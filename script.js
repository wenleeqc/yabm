let myLinks = JSON.parse(localStorage.getItem('myLinks')) ? JSON.parse(localStorage.getItem('myLinks')) : [];

const tabBtn = document.querySelector('#save-tab-btn');
const surpriseBtn = document.querySelector('.surprise-btn-link');
const moreFeaturesToggle = document.querySelector('#more-features-toggle');
const moreFeatures = document.querySelector('.more-features');
const inputBtn = document.querySelector('#input-btn');
const inputBox = document.querySelector('#input-box');
const clearBtn = document.querySelector('#clear-btn');
const warningText = document.querySelector('.warning');
const linkContainer = document.querySelector('.link-container');
const lis = document.querySelectorAll('li');

tabBtn.addEventListener("click", () => {    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const newLink = tabs[0].url.replace(/^(https?:\/\/)/i, "");
        if(!myLinks.includes(newLink)) {
            renderLink(newLink);
            myLinks.push(newLink);
            localStorage.setItem('myLinks', JSON.stringify(myLinks));
        }
    })
})

surpriseBtn.addEventListener('click', () => {
    if(!!myLinks.length) {
        const randomNumber = Math.floor(Math.random() * myLinks.length);
        const randomLink = `https://${myLinks[randomNumber]}`;
        surpriseBtn.href = randomLink;
    }
});

moreFeaturesToggle.addEventListener('click', () => {
    moreFeatures.classList.toggle('remove');
    if(moreFeatures.classList.contains('remove')) {
        moreFeaturesToggle.textContent = "more features..."
    } else {
        moreFeaturesToggle.textContent = 'less features...'
    }
});

inputBox.addEventListener('keyup', (e) => {
    if(e.key === "Enter" || e.keyCode === 13) {
        const newLink = inputBox.value;
        if(newLink && !myLinks.includes(newLink)) {
            renderLink(newLink);
            myLinks.push(newLink);
            localStorage.setItem('myLinks', JSON.stringify(myLinks));
            inputBox.value = "";
        }
    }
});

inputBtn.addEventListener('click', () => {
    const newLink = inputBox.value;
    if(newLink && !myLinks.includes(newLink)) {
        renderLink(newLink);
        myLinks.push(newLink);
        localStorage.setItem('myLinks', JSON.stringify(myLinks));
        inputBox.value = "";
    }
});

clearBtn.addEventListener('mouseover', () => {
    warningText.style.opacity = '1';
});

clearBtn.addEventListener('mouseout', () => {
    warningText.style.opacity = '0';
})

clearBtn.addEventListener('click', deleteAllLinks); 

renderLinks()

function renderLinks() {
    for(link of myLinks) {
        renderLink(link)
    }
}

function renderLink(link) {
    const newLi = document.createElement('li');
    const newA = document.createElement('a');
    newA.textContent = link;
    newA.setAttribute('href', `https://${link}`);
    newA.setAttribute('target', "_blank");

    const newSpan = document.createElement('span')
    newSpan.classList.add('delete-container');

    const newDeleteBtn = document.createElement('span');
    newDeleteBtn.classList.add('delete');
    newDeleteBtn.classList.add('xbtn');
    newDeleteBtn.classList.add('hidden');
    addRemoveLinkListener(newDeleteBtn);

    const newImg = document.createElement('img');
    newImg.src = faviconURL(`https://${link}`)

    addDeleteHoverOn(newSpan, newImg, newDeleteBtn);
    addDeleteHoverOff(newSpan, newImg, newDeleteBtn);

    newSpan.append(newImg, newDeleteBtn);
    newLi.append(newSpan, newA);
    linkContainer.appendChild(newLi);
}

function addRemoveLinkListener(link) {
    link.addEventListener('click', () => {
        const index = myLinks.indexOf(link.textContent)
        myLinks.splice(index, 1);
        link.parentElement.parentElement.remove();
        localStorage.setItem('myLinks', JSON.stringify(myLinks));
    });
}

function addDeleteHoverOn(container, img, deletebtn) {
    container.addEventListener('mouseover', () => {
        img.classList.add('hidden');
        deletebtn.classList.remove('hidden');
    })
}

function addDeleteHoverOff(container, img, deletebtn) {
    container.addEventListener('mouseout', () => {
        deletebtn.classList.add('hidden');
        img.classList.remove('hidden');
    })
}

function deleteAllLinks() {
    linkContainer.innerHTML = "";
    myLinks = []
    localStorage.setItem('myLinks', null);
}

function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "16");
    return url.toString();
}
