let myLinks = JSON.parse(localStorage.getItem('myLinks')) ? JSON.parse(localStorage.getItem('myLinks')) : [];

const inputBtn = document.querySelector('#input-btn');
const inputBox = document.querySelector('#input-box');
const tabBtn = document.querySelector('#save-tab-btn');
const deleteToggleBtn = document.querySelector('#delete-toggle');
const moreFeaturesToggle = document.querySelector('#more-features-toggle');
const moreFeatures = document.querySelector('.more-features');
const clearBtn = document.querySelector('#clear-btn');
const warningText = document.querySelector('.warning');
const linkContainer = document.querySelector('.link-container');
const lis = document.querySelectorAll('li');

deleteToggleBtn.addEventListener('click', () => {
    const deleteBtns = document.querySelectorAll(".delete");
    const imgs = document.querySelectorAll('img');
    deleteToggleBtn.classList.toggle('enabled');

    for(btn of deleteBtns) {
        btn.classList.toggle('hidden');
    }
    for(img of imgs) {
        img.classList.toggle('hidden');
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

clearBtn.addEventListener('mouseover', () => {
    warningText.style.opacity = '1';
});

clearBtn.addEventListener('mouseout', () => {
    warningText.style.opacity = '0';
})

clearBtn.addEventListener('click', deleteAllLinks); 

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
    addRemoveLinkListener(newDeleteBtn);

    const newImg = document.createElement('img');
    newImg.src = faviconURL(`https://${link}`)

    if(!deleteToggleBtn.classList.contains('enabled')) {
        newDeleteBtn.classList.add('hidden');
    } else {
        newImg.classList.add('hidden')
    }

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
