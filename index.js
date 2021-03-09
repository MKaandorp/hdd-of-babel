// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
   function getUrlFromFile() {
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader()
      reader.onloadend = async function (event) {
         var dataUrl = event.target.result;
         if (base64MimeType(dataUrl, true) == 'image') {
            var maxUrlLength = Math.floor(0.75 * (8201 - location.href.length));
            var maxDeviation = 1000;
            dataUrl = await resizeImage(dataUrl, maxUrlLength - maxDeviation, maxDeviation);
         }
         if (dataUrl.length > (8201 - location.href.length)) {
            document.getElementById('urlFound').innerHTML = "Unfortunately the HDD of Babel does not contain files this large. Please submit a smaller file."
         }
         else {
            document.getElementById('urlFound').innerHTML = "Your data has been found on the HDD of Babel! It can be found in this location: ";
            //document.getElementById('urlLength').innerHTML = "URL length: " + (location.href + reverseString(Base64.encodeURI(dataUrl))).length;
            document.getElementById('urlToPage').innerHTML = location.href + reverseString(Base64.encodeURI(dataUrl));
            document.getElementById('urlToPage').setAttribute('href', location.href + reverseString(Base64.encodeURI(dataUrl)));
         }
      };
      reader.readAsDataURL(file);
   }
} else {
   alert("Your browser is too old to support HTML5 File API");
}

function getUrlFromText() {
   var text = document.getElementById("textareabox").value;
   document.getElementById('urlFound').innerHTML = "Your data has been found on the HDD of Babel! It can be found in this location: ";
   document.getElementById('urlToPage').innerHTML = location.href + reverseString(Base64.encodeURI("data:text/plain;base64," + Base64.encodeURI(text)));
   document.getElementById('urlToPage').setAttribute('href', location.href + reverseString(Base64.encodeURI("data:text/plain;base64," + Base64.encodeURI(text))));
}

function reverseString(str) {
   return str.split("").reverse().join("");
}

//https://stackoverflow.com/a/62662855
async function resizeImage(dataUrl, targetUrlLength, maxDeviation = 1) {
   if (dataUrl.length < targetUrlLength)
      return dataUrl; // File is already smaller

   document.getElementById('fileConverted').innerHTML = "The HDD of Babel does not contain files this large, but does contain a compressed version of this image. Otherwise, please try a smaller file.";

   let low = 0.0;
   let middle = 0.5;
   let high = 1.0;

   let result = dataUrl;

   let urlLength = dataUrl.length;

   while (Math.abs(targetUrlLength - urlLength) > maxDeviation) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const img = document.createElement('img');

      const promise = new Promise((resolve, reject) => {
         img.onload = () => resolve();
         img.onerror = reject;
      });

      img.src = dataUrl;

      await promise;

      canvas.width = Math.round(img.width * middle);
      canvas.height = Math.round(img.height * middle);
      context.scale(canvas.width / img.width, canvas.height / img.height);
      context.drawImage(img, 0, 0);
      urlLength = canvas.toDataURL("image/jpeg", middle).length;

      if (urlLength < (targetUrlLength - maxDeviation)) {
         low = middle;
      }
      else if (urlLength > targetUrlLength) {
         high = middle;
      }

      middle = (low + high) / 2;
      result = canvas.toDataURL("image/jpeg", middle);
   }

   return result;
}

function base64MimeType(encoded, onlyBase = false) {
   var result = null;

   if (typeof encoded !== 'string') {
      return result;
   }

   var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

   if (mime && mime.length) {
      result = mime[1];
   }

   if (onlyBase) {
      result = result.split('/')[0];
   }

   return result;
}

function generateUrlRandomPage() {
   var maxUrlLength = 8201 - location.href.length;
   var strLength = Math.floor(Math.random() * maxUrlLength) + 1;
   var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
   var result = '';
   for (var i = 0; i < strLength; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
   }
   return location.href + result;
}

document.getElementById("random-page").setAttribute("href", generateUrlRandomPage());

