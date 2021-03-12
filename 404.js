function get_url() {
    console.log(location.href);
    var dataURL = urlToString(location.href);
    var mimeType = base64MimeType(dataURL);
    console.log(mimeType);
    createDownloadUrl(dataURL, mimeType);
    displayContent(dataURL, mimeType);
}

function urlToString(url) {
    var splittedUrl = url.split('/');
    var urlText = splittedUrl[splittedUrl.length - 1];
    return Base64.decode(reverseString(urlText));
}


function base64MimeType(encoded) {
    var result = null;

    if (typeof encoded !== 'string') {
        return result;
    }

    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
        result = mime[1];
    }

    return result;
}

function reverseString(str) {
    return str.split("").reverse().join("");
}

function displayContent(dataURL, mimeType) {
    var dataContent = dataURL.split(',')[1];
    var mimeTypeX = null;
    if(mimeType !== null){
        mimeTypeX = mimeType.split('/')[0];
    }
    switch (mimeTypeX) {
        case "image":
            document.getElementById('result').innerHTML = "<img src=" + dataURL + ">";
            break;
        case "text":
            if (mimeType == "text/html") {
                var newNode = document.createElement('iframe');
                newNode.srcdoc = Base64.decode(dataContent);
                newNode.sandbox = "allow-scripts allow-same-origin";
                newNode.width = "100%";
                newNode.height = "1000px";
                document.getElementById('result').appendChild(newNode);
            }
            else {
                document.getElementById('result').innerHTML = "<p>" + Base64.decode(dataContent) + "</p>";
            }
            break;
        case "audio":
            document.getElementById('result').innerHTML = `
            <audio controls>
            <source src=${dataURL}>
            Your browser does not support the audio element.
            </audio>
            `
            break;
        case "video":
            document.getElementById('result').innerHTML = `
            <video width="320" height="240" controls>
            <source src=${dataURL}>
            Your browser does not support the video tag.
            </video>
            `
            break;
        default:
            document.getElementById('result').innerHTML = "Unfortunately we don't know how to display this data. However, you can still download the file."


    }
}

function createSmallPageId() {
    var splittedUrl = location.href.split('/');
    var pageId = splittedUrl[splittedUrl.length - 1];
    return pageId.substr(0, 6) + "..." + pageId.substr(pageId.length - 6, pageId.length - 1);
}

function displayWelcome() {

    document.getElementById('welcome').innerHTML = `Welcome to page <a href='${location.href}'>${createSmallPageId()}</a>!`
}

function createDownloadUrl(dataUrl, mimeType) {
    var extension = "." + mime.getExtension(mimeType);
    if (extension == '.null') {
        extension = '';
    }
    document.getElementById('download_link').setAttribute('href', dataUrl);
    document.getElementById('download_link').setAttribute('download', createSmallPageId() + extension);
}

displayWelcome();
get_url();