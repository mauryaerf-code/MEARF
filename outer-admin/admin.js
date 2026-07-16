// Configurations and State Variables
let config = {};
let supabaseClient = null;
let activeTab = 'events';
let selectedJournal = 'Shodh Unnayan';

let events = [];
let books = [];
let articles = [];
let members = [];

let localPreviews = {};
let isDbOnline = true;

let tokenClient = null;
let gdriveToken = null;

// Helper to extract Google Drive CDN URLs
function getEmbeddableDriveUrl(url) {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
}

// Helper to extract Google Drive File ID from url
function getDriveFileId(url) {
    if (!url) return null;
    const regExp = /(?:id=|\/d\/|d=)([a-zA-Z0-9_-]{25,})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
}

// Toast alerts helper
function triggerAlert(msg) {
    const toast = document.getElementById('toast-alert');
    const textElement = document.getElementById('toast-text');
    textElement.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Tab Switching logic
function switchTab(tabId) {
    activeTab = tabId;
    
    // Toggle active buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${tabId}`).classList.add('active');
    
    // Toggle active sections
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// Fetch and parse local .env file (if running on a local server)
async function fetchAndParseEnv() {
    try {
        const response = await fetch('.env');
        if (!response.ok) return null;
        const text = await response.text();
        
        // If the server returned an HTML page (e.g. custom 404 redirect), discard it
        if (text.trim().startsWith('<') || text.includes('<!DOCTYPE html>') || text.includes('<html')) {
            return null;
        }

        const lines = text.split('\n');
        const parsed = {};
        let hasKeys = false;
        for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine || cleanLine.startsWith('#')) continue;
            const index = cleanLine.indexOf('=');
            if (index > 0) {
                const key = cleanLine.substring(0, index).trim();
                const value = cleanLine.substring(index + 1).trim();
                parsed[key] = value;
                if (key === 'SUPABASE_URL' || key === 'SUPABASE_ANON_KEY') {
                    hasKeys = true;
                }
            }
        }
        return hasKeys ? parsed : null;
    } catch (e) {
        return null; // Silent catch, CORS or file-not-found
    }
}

// Fetch folder IDs and configurations (from .env or config.js fallback)
async function loadConfig() {
    // 1. Try to load config from local .env fetch
    const envConfig = await fetchAndParseEnv();
    if (envConfig) {
        config = {
            supabaseUrl: envConfig.SUPABASE_URL || window.MERF_CONFIG?.supabaseUrl,
            supabaseAnonKey: envConfig.SUPABASE_ANON_KEY || window.MERF_CONFIG?.supabaseAnonKey,
            googleClientId: envConfig.GOOGLE_CLIENT_ID || window.MERF_CONFIG?.googleClientId,
            folderBooks: envConfig.FOLDER_BOOKS || window.MERF_CONFIG?.folderBooks,
            folderJournalCovers: envConfig.FOLDER_JOURNAL_COVERS || window.MERF_CONFIG?.folderJournalCovers,
            folderJournalPdfs: envConfig.FOLDER_JOURNAL_PDFS || window.MERF_CONFIG?.folderJournalPdfs
        };
        console.log('Configurations loaded successfully from local .env file.');
    } else {
        // 2. Fallback to config.js window variable
        config = window.MERF_CONFIG || {};
        console.log('Configurations loaded successfully from config.js fallback.');
    }
    
    // Initialize Supabase Client
    if (window.supabase && config.supabaseUrl && config.supabaseAnonKey) {
        supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    } else {
        console.error('Supabase library or credentials missing. Check config.js or your .env file.');
    }

    // Set Folder URLs in description tags
    const booksLink = document.getElementById('folder-books-link');
    if (booksLink && config.folderBooks) {
        booksLink.href = `https://drive.google.com/drive/folders/${config.folderBooks}`;
    }
    const coversLink = document.getElementById('folder-covers-link');
    if (coversLink && config.folderJournalCovers) {
        coversLink.href = `https://drive.google.com/drive/folders/${config.folderJournalCovers}`;
    }
    const pdfsLink = document.getElementById('folder-pdfs-link');
    if (pdfsLink && config.folderJournalPdfs) {
        pdfsLink.href = `https://drive.google.com/drive/folders/${config.folderJournalPdfs}`;
    }

    // Attempt to load gdrive access token from sessionStorage
    const savedToken = sessionStorage.getItem('gdrive_access_token');
    if (savedToken) {
        gdriveToken = savedToken;
        updateGDriveWarningBar(true);
    }

    // Initialize Google Identity Services OAuth 2 Client
    initTokenClient();

    return true;
}

// Initialize Google Identity Client (GIS popup client)
function initTokenClient() {
    if (typeof google === 'undefined' || !google.accounts) {
        setTimeout(initTokenClient, 300);
        return;
    }
    
    if (!config.googleClientId) {
        console.warn('googleClientId is missing. Personal Google Drive uploads will remain simulated.');
        return;
    }

    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: config.googleClientId,
            scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive',
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    gdriveToken = tokenResponse.access_token;
                    sessionStorage.setItem('gdrive_access_token', gdriveToken);
                    updateGDriveWarningBar(true);
                    triggerAlert('Successfully authorized Google Drive integration!');
                }
            }
        });
    } catch (e) {
        console.error('Failed to initialize Google Identity client:', e.message);
    }
}

// Show/hide Google Drive Authorization status bar
function updateGDriveWarningBar(isConnected) {
    const warningBar = document.getElementById('gdrive-warning-bar');
    const authBtn = document.getElementById('btn-gdrive-auth');
    if (isConnected) {
        warningBar.classList.add('hidden');
        if (authBtn) {
            authBtn.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
            authBtn.classList.remove('btn-accent');
            authBtn.classList.add('btn-outline');
            authBtn.disabled = true;
        }
    } else {
        warningBar.classList.remove('hidden');
        if (authBtn) {
            authBtn.innerHTML = '<i class="fas fa-plug"></i> Authorize Google Drive';
            authBtn.classList.add('btn-accent');
            authBtn.classList.remove('btn-outline');
            authBtn.disabled = false;
        }
    }
}

// Launch Google Accounts auth consent window
function handleGoogleAuthRedirect() {
    if (!tokenClient) {
        alert('Google Identity Client is not initialized yet. Verify the clientid is set in config.js or .env.');
        return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
}

// Test database connection
async function testDbConnection() {
    if (!supabaseClient) {
        isDbOnline = false;
        document.getElementById('db-warning-bar').classList.remove('hidden');
        return;
    }
    try {
        const { error } = await supabaseClient.from('merf_events').select('id').limit(1);
        if (error) throw error;
        
        isDbOnline = true;
        document.getElementById('db-warning-bar').classList.add('hidden');
    } catch (err) {
        console.error('Database connection failed. Supabase project might be paused:', err);
        isDbOnline = false;
        document.getElementById('db-warning-bar').classList.remove('hidden');
    }
}

// Retry DB Connection callback
async function retryConnection() {
    await testDbConnection();
    if (isDbOnline) {
        fetchEvents();
        fetchBooks();
        fetchArticles();
        fetchMembers();
        triggerAlert('Successfully re-established database connection!');
    }
}

// --- DATA READ METHODS ---
async function fetchEvents() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('merf_events')
            .select('*')
            .order('date', { ascending: false });
            
        if (!error && data) {
            events = data;
            isDbOnline = true;
            renderEventsTable();
        } else {
            if (error) console.error('Event Fetch Error:', error.message);
        }
    } catch (err) {
        console.error('Failed to fetch events from Supabase:', err);
    }
}

async function fetchBooks() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('merf_books')
            .select('*')
            .order('id', { ascending: false });
            
        if (!error && data) {
            books = data.map(b => ({
                id: b.id,
                title: b.title,
                authors: b.author || b.authors,
                isbn: b.isbn,
                year: parseInt(b.year, 10) || b.year,
                coverUrl: b.coverurl || b.coverUrl || b.coverURL
            }));
            isDbOnline = true;
            renderBooksTable();
        } else {
            if (error) console.error('Book Fetch Error:', error.message);
        }
    } catch (err) {
        console.error('Failed to fetch books from Supabase:', err);
    }
}

async function fetchArticles() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('merf_issues')
            .select('*')
            .eq('journal', selectedJournal)
            .order('id', { ascending: false });
            
        if (!error && data) {
            articles = data.map(a => ({
                id: a.id,
                year: a.year,
                volume: a.volume || '',
                issue: a.issue || '',
                pdfUrl: a.pdfurl || a.pdfUrl || a.pdfURL
            }));
            isDbOnline = true;
            renderArticlesTable();
        } else {
            if (error) console.error('Article Fetch Error:', error.message);
        }
    } catch (err) {
        console.error('Failed to fetch articles from Supabase:', err);
    }
}

// --- RENDER TABLES METHODS ---
function renderEventsTable() {
    const tbody = document.getElementById('events-table-body');
    if (events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No scheduled events registered.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = events.map(ev => `
        <tr>
            <td>
                <strong style="color: var(--primary-dark); display: block;">${ev.title}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${(ev.description || '').substring(0, 100)}...</span>
            </td>
            <td>
                <span style="font-weight: 500;">${ev.date}</span>
                <span class="badge badge-accent" style="display: block; width: fit-content; marginTop: 4px;">${ev.type}</span>
            </td>
            <td>${ev.location}</td>
            <td class="text-center">
                <button onclick="handleDeleteEvent('${ev.id}')" class="btn btn-danger btn-sm">
                    <i class="far fa-trash-can"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function renderBooksTable() {
    const tbody = document.getElementById('books-table-body');
    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No books registered in catalog.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = books.map(bk => `
        <tr>
            <td>
                ${bk.coverUrl ? `
                    <img src="${getEmbeddableDriveUrl(bk.coverUrl)}" alt="Cover" style="width: auto; max-width: 50px; height: auto; max-height: 70px; object-fit: contain; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.08);" />
                ` : `
                    <span style="font-size: 0.75rem; color: var(--text-muted);">No Cover</span>
                `}
            </td>
            <td>
                <strong style="color: var(--primary-dark); display: block;">${bk.title}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted);">By ${bk.authors} &bull; Year ${bk.year}</span>
            </td>
            <td><code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${bk.isbn}</code></td>
            <td class="text-center">
                <button onclick="handleDeleteBook('${bk.id}')" class="btn btn-danger btn-sm">
                    <i class="far fa-trash-can"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function renderArticlesTable() {
    const tbody = document.getElementById('articles-table-body');
    document.getElementById('journal-catalog-title').textContent = `Published Issues Catalog (${selectedJournal})`;
    
    if (articles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No published issues registered for this journal context.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = articles.map(art => `
        <tr>
            <td>
                <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">${art.year}</span>
            </td>
            <td>
                <span style="font-size: 0.9rem; font-weight: 500; color: var(--primary-dark);">${art.volume}</span>
            </td>
            <td>
                ${art.pdfUrl ? `
                    <a href="${art.pdfUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-dark); font-weight: bold; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                        <i class="far fa-file-pdf"></i> ${art.issue}
                    </a>
                ` : `
                    <span style="font-size: 0.9rem; color: var(--text-muted);">${art.issue}</span>
                `}
            </td>
            <td class="text-center">
                <button onclick="handleDeleteArticle('${art.id}')" class="btn btn-danger btn-sm">
                    <i class="far fa-trash-can"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// --- JOURNAL SELECTOR EVENT ---
function handleJournalContextChange() {
    selectedJournal = document.getElementById('journal-context').value;
    fetchArticles();
}

// --- PURE CLIENT-SIDE FILE UPLOAD HANDLER ---
async function uploadFileToGDrive(file, folderId) {
    if (!gdriveToken) {
        // Fallback to simulated upload if not authorized
        console.warn('Google Drive not authorized. Simulating upload.');
        const fileId = `${folderId}_sim_${Math.random().toString(36).substring(2, 12)}`;
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const driveUrl = isPdf
            ? `https://drive.google.com/file/d/${fileId}/view`
            : `https://drive.google.com/uc?export=view&id=${fileId}`;

        return {
            success: true,
            simulated: true,
            fileId: fileId,
            url: driveUrl,
            message: 'Simulated upload successful (Authorize Google Drive for real uploads).'
        };
    }

    const metadata = {
        name: file.name,
        parents: [folderId]
    };

    // Multipart body construction
    const boundary = '3294829348293849';
    const delimiter = `--${boundary}\r\n`;
    const subDelimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const reader = new FileReader();
    const fileLoadPromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
    });
    
    reader.readAsArrayBuffer(file);
    const arrayBuffer = await fileLoadPromise;
    const bytes = new Uint8Array(arrayBuffer);
    
    // We construct the multipart request payload using a Blob
    const metadataPart = delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata);

    const mediaHeaderBinary = subDelimiter +
        `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;
        
    const reqBlob = new Blob([
        metadataPart,
        mediaHeaderBinary,
        bytes,
        closeDelimiter
    ], { type: `multipart/related; boundary=${boundary}` });

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${gdriveToken}`
        },
        body: reqBlob
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to upload file to Google Drive.');
    }

    const data = await response.json();
    const fileId = data.id;

    // Set permission to anyone reader so it's publicly accessible
    try {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${gdriveToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: 'reader',
                type: 'anyone'
            })
        });
    } catch (e) {
        console.warn('Failed to set file permissions to public:', e.message);
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const publicUrl = isPdf
        ? `https://drive.google.com/file/d/${fileId}/view`
        : `https://drive.google.com/uc?export=view&id=${fileId}`;

    return {
        success: true,
        simulated: false,
        fileId: fileId,
        url: publicUrl
    };
}

async function handleBookCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const objectUrl = URL.createObjectURL(file);
    const spinner = document.getElementById('book-cover-uploading');
    const previewWrapper = document.getElementById('book-cover-preview-wrapper');
    const previewImg = document.getElementById('book-cover-preview');
    const submitBtn = document.getElementById('book-submit-btn');
    
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    try {
        const data = await uploadFileToGDrive(file, config.folderBooks || '1C797s_NLW38INWIqcixR30XOhTH1Lx2G');
        document.getElementById('book-cover-url').value = data.url;
        
        localPreviews[data.url] = objectUrl;
        previewImg.src = objectUrl;
        previewWrapper.classList.remove('hidden');
        triggerAlert('Book cover uploaded successfully!');
    } catch (err) {
        console.error(err);
        alert(`Upload Failed: ${err.message}`);
    } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

async function handleArticleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const objectUrl = URL.createObjectURL(file);
    const spinner = document.getElementById('article-cover-uploading');
    const previewWrapper = document.getElementById('article-cover-preview-wrapper');
    const previewImg = document.getElementById('article-cover-preview');
    const submitBtn = document.getElementById('article-submit-btn');
    
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    try {
        const data = await uploadFileToGDrive(file, config.folderJournalCovers || '1S3yJDVFRSoGjZS_DOGmpTx2kE-RZ-Xbm');
        document.getElementById('article-cover-url').value = data.url;
        
        localPreviews[data.url] = objectUrl;
        previewImg.src = objectUrl;
        previewWrapper.classList.remove('hidden');
        triggerAlert('Journal cover image uploaded successfully!');
    } catch (err) {
        console.error(err);
        alert(`Upload Failed: ${err.message}`);
    } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

async function handleArticlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const spinner = document.getElementById('article-pdf-uploading');
    const submitBtn = document.getElementById('article-submit-btn');
    
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    try {
        const data = await uploadFileToGDrive(file, config.folderJournalPdfs || '1Hre4DKzSTSowNfVPETcgZ-Qr2UiuBckj');
        document.getElementById('article-pdf-url').value = data.url;
        triggerAlert('Journal article PDF document uploaded successfully!');
    } catch (err) {
        console.error(err);
        alert(`Upload Failed: ${err.message}`);
    } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

// --- DELETE HANDLERS ---
async function handleDeleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event scheduled entry?')) return;
    if (!supabaseClient) return;
    
    try {
        const { error } = await supabaseClient
            .from('merf_events')
            .delete()
            .eq('id', id);
            
        if (error) {
            alert('Delete failed: ' + error.message);
            return;
        }
        
        triggerAlert('Event deleted from catalog.');
        fetchEvents();
    } catch (err) {
        console.error(err);
        alert('Failed to delete event: Database connection error.');
    }
}

async function deleteDriveFile(fileUrl) {
    const fileId = getDriveFileId(fileUrl);
    if (!fileId || !gdriveToken) return;
    
    try {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${gdriveToken}`
            }
        });
    } catch (e) {
        console.warn('Failed to delete resource from Google Drive:', e.message);
    }
}

async function handleDeleteBook(id) {
    if (!confirm('Are you sure you want to delete this book from the catalog?')) return;
    if (!supabaseClient) return;
    
    try {
        const book = books.find(b => b.id === id);
        if (book && book.coverUrl) {
            await deleteDriveFile(book.coverUrl);
        }
        
        const { error } = await supabaseClient
            .from('merf_books')
            .delete()
            .eq('id', id);
            
        if (error) {
            alert('Delete failed: ' + error.message);
            return;
        }
        
        triggerAlert('Book deleted from catalog.');
        fetchBooks();
    } catch (err) {
        console.error(err);
        alert('Failed to delete book: Database connection error.');
    }
}

async function handleDeleteArticle(id) {
    if (!confirm('Are you sure you want to delete this journal article entry?')) return;
    if (!supabaseClient) return;
    
    try {
        const article = articles.find(a => a.id === id);
        if (article) {
            if (article.coverUrl) await deleteDriveFile(article.coverUrl);
            if (article.pdfUrl) await deleteDriveFile(article.pdfUrl);
        }
        
        const { error } = await supabaseClient
            .from('merf_issues')
            .delete()
            .eq('id', id);
            
        if (error) {
            alert('Delete failed: ' + error.message);
            return;
        }
        
        triggerAlert('Journal entry deleted from catalog.');
        fetchArticles();
    } catch (err) {
        console.error(err);
        alert('Failed to delete journal article: Database connection error.');
    }
}

// --- FORM SUBMIT HANDLERS ---
async function handleAddEvent(e) {
    e.preventDefault();
    if (!supabaseClient) return;
    
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const type = document.getElementById('event-type').value;
    const location = document.getElementById('event-location').value;
    const description = document.getElementById('event-description').value;
    const link = document.getElementById('event-link').value;
    
    try {
        const { error } = await supabaseClient
            .from('merf_events')
            .insert([{
                title,
                date,
                type,
                location,
                description,
                registrationlink: link || null
            }]);
            
        if (error) {
            alert('Failed to insert event: ' + error.message);
            return;
        }
        
        triggerAlert('Event successfully published to Supabase.');
        document.getElementById('form-add-event').reset();
        fetchEvents();
    } catch (err) {
        console.error(err);
        alert('Failed to insert event: Database connection error.');
    }
}

async function handleAddBook(e) {
    e.preventDefault();
    if (!supabaseClient) return;
    
    const title = document.getElementById('book-title').value;
    const authors = document.getElementById('book-authors').value;
    const isbn = document.getElementById('book-isbn').value;
    const year = document.getElementById('book-year').value;
    const coverurl = document.getElementById('book-cover-url').value;
    
    if (!coverurl) {
        alert('Please provide or upload a cover image link first.');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('merf_books')
            .insert([{
                title,
                author: authors,
                isbn,
                year: year,
                coverurl: coverurl
            }]);
            
        if (error) {
            alert('Failed to insert book: ' + error.message);
            return;
        }
        
        triggerAlert('Book successfully publication registered & synced.');
        document.getElementById('form-add-book').reset();
        document.getElementById('book-cover-preview-wrapper').classList.add('hidden');
        document.getElementById('book-cover-file').value = '';
        fetchBooks();
    } catch (err) {
        console.error(err);
        alert('Failed to save book: Database connection error.');
    }
}

async function handleAddArticle(e) {
    e.preventDefault();
    if (!supabaseClient) return;
    
    const volume = document.getElementById('article-volume').value;
    const issue = document.getElementById('article-issue').value;
    const year = document.getElementById('article-year').value;
    const pdfurl = document.getElementById('article-pdf-url').value;
    
    if (!pdfurl) {
        alert('Please provide the PDF document URL.');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('merf_issues')
            .insert([{
                journal: selectedJournal,
                volume: volume,
                issue: issue,
                year: year,
                pdfurl: pdfurl
            }]);
            
        if (error) {
            alert('Failed to insert issue: ' + error.message);
            return;
        }
        
        triggerAlert('Published issue successfully saved & synced.');
        document.getElementById('form-add-article').reset();
        document.getElementById('article-pdf-file').value = '';
        fetchArticles();
    } catch (err) {
        console.error(err);
        alert('Failed to save issue entry: Database connection error.');
    }
}

// --- MEMBERS MANAGEMENT HANDLERS ---
async function fetchMembers() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('merf_members')
            .select('*')
            .order('order_index', { ascending: true });
            
        if (!error && data) {
            members = data;
            isDbOnline = true;
            renderMembersTable();
        } else {
            if (error) console.error('Members Fetch Error:', error.message);
        }
    } catch (err) {
        console.error('Failed to fetch members from Supabase:', err);
    }
}

function renderMembersTable() {
    const tbody = document.getElementById('members-table-body');
    if (!tbody) return;
    if (members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No board members registered.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>
                ${member.imageurl ? `
                    <img src="${getEmbeddableDriveUrl(member.imageurl)}" alt="Photo" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent);" />
                ` : `
                    <span style="font-size: 0.75rem; color: var(--text-muted);">No Photo</span>
                `}
            </td>
            <td>
                <strong style="color: var(--primary-dark); display: block;">${member.name}</strong>
            </td>
            <td>
                <span style="font-size: 0.85rem; color: var(--text-muted); display: block;">${member.designation}</span>
                <span style="font-size: 0.8rem; font-style: italic; color: var(--accent-dark);">${member.affiliation}</span>
            </td>
            <td>
                <span class="badge badge-primary">${member.board_type}</span>
            </td>
            <td class="text-center">
                <button onclick="handleDeleteMember('${member.id}')" class="btn btn-danger btn-sm">
                    <i class="far fa-trash-can"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

async function handleAddMember(e) {
    e.preventDefault();
    if (!supabaseClient) return;
    
    const name = document.getElementById('member-name').value;
    const designation = document.getElementById('member-designation').value;
    const affiliation = document.getElementById('member-affiliation').value;
    const board_type = document.getElementById('member-board-type').value;
    const imageurl = document.getElementById('member-image-url').value;
    const order_index = parseInt(document.getElementById('member-order-index').value) || 0;
    
    try {
        const { error } = await supabaseClient
            .from('merf_members')
            .insert([{
                name,
                designation,
                affiliation,
                board_type,
                imageurl,
                order_index
            }]);
            
        if (error) {
            alert('Failed to insert member: ' + error.message);
            return;
        }
        
        triggerAlert('Board member successfully saved & synced.');
        document.getElementById('form-add-member').reset();
        document.getElementById('member-image-file').value = '';
        fetchMembers();
    } catch (err) {
        console.error(err);
        alert('Failed to save board member entry: Database connection error.');
    }
}

async function handleDeleteMember(id) {
    if (!confirm('Are you sure you want to delete this board member?')) return;
    if (!supabaseClient) return;
    
    try {
        const member = members.find(m => m.id === id);
        if (member && member.imageurl) {
            await deleteDriveFile(member.imageurl);
        }
        
        const { error } = await supabaseClient
            .from('merf_members')
            .delete()
            .eq('id', id);
            
        if (error) {
            alert('Delete failed: ' + error.message);
            return;
        }
        
        triggerAlert('Board member deleted from catalog.');
        fetchMembers();
    } catch (err) {
        console.error(err);
        alert('Failed to delete board member: Database connection error.');
    }
}

async function handleMemberImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const spinner = document.getElementById('member-image-uploading');
    const submitBtn = document.getElementById('member-submit-btn');
    
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    try {
        const data = await uploadFileToGDrive(file, config.folderJournalCovers || '1S3yJDVFRSoGjZS_DOGmpTx2kE-RZ-Xbm');
        document.getElementById('member-image-url').value = data.url;
        triggerAlert('Profile photo uploaded successfully!');
    } catch (err) {
        console.error(err);
        alert(`Upload Failed: ${err.message}`);
    } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', async () => {
    const loaded = await loadConfig();
    if (loaded) {
        // Run database connection check in background
        testDbConnection();
        
        // Fetch catalogs independently to ensure robust UI loading
        fetchEvents();
        fetchBooks();
        fetchArticles();
        fetchMembers();
    }
});
