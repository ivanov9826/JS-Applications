function attachEvents() {
    document.getElementById('btnLoadPosts').addEventListener('click' , getPosts);
};

attachEvents();

async function getPosts(){
    const url = 'http://localhost:3030/jsonstore/blog/posts';

    const response = await fetch(url);
    const data = await response.json();
    const postEl = document.getElementById('posts')
    
    Object.values(data).map(createOption).forEach( o => postEl.appendChild(o));

    document.getElementById('btnViewPost').addEventListener('click' , displayPost);;
    document.getElementById('btnLoadPosts').removeEventListener('click' , getPosts)

};

function createOption(post){
    const option = document.createElement('option');
    option.textContent = post.title;
    option.value = post.id;

    return option;
};

function displayPost(){
    const postId = document.getElementById('posts').value
    getCommentsByPostId(postId)
}

async function getCommentsByPostId(postId){
    const commentsUrl = 'http://localhost:3030/jsonstore/blog/comments';
    const postUrl = 'http://localhost:3030/jsonstore/blog/posts/' + postId;

    [postResponse , commentsResponse] = await Promise.all([
        fetch(postUrl),
        fetch(commentsUrl)
    ]);
    

    const commentsData = await commentsResponse.json();

    const comments = Object.values(commentsData).filter(c => c.postId == postId);

    const postData = await postResponse.json();

    document.getElementById('post-title').textContent = postData.title;
    document.getElementById('post-body').textContent = postData.body;

    const ul = document.getElementById('post-comments');
    ul.innerHTML = ''

    comments.forEach(e =>{
        const li = document.createElement('li');
        li.textContent = e.text;
        ul.appendChild(li);
    });
};