// image preview
const imagePreview = document.querySelector('#imagePreview');
function previewImage(event) {
    imagePreview.style.display = 'block';
    imagePreview.innerHTML = '';
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const img = document.createElement('img');
        img.src = reader.result;
        imagePreview.appendChild(img);
    };

    reader.readAsDataURL(file);
}
// get local date funtion
function getCurrentTime() {
    const currentTime = new Date();
    return currentTime.toLocaleString();
}

// validation
let title = document.querySelector('#title');
let title_limit = 30;
let description = document.querySelector('#description');
let description_limit = 200;
let image = document.querySelector('#image');
let categories = document.querySelectorAll('[name="Categories"]');
let isSelected = false;
let formerrors = document.querySelectorAll('.form-error');
let form_1 = document.querySelector('.form-1');
let form_2 = document.querySelector('.form-2');
const blogData = {};
let form_head = document.querySelector('#form-head');
form_head.textContent = 'Create Post';
let editBlogId = null;

function submitForm() {
    let isValid = true;
    clearErrors();

    // title validation
    if (title.value.trim() === '') {
        formerrors[0].innerHTML = 'Title is required';
        title.parentElement.classList.add('has-error');
        isValid = false;
    }
    else if (title.value.trim().length > title_limit || title.value.trim().length < 4) {
        formerrors[0].innerHTML = 'Title must have min 4 and max 30 characters';
        title.parentElement.classList.add('has-error');
        isValid = false;
    }
    else {
        blogData.blogTitle = title.value;
    }

    // description validation
    if (description.value.trim() === '') {
        formerrors[1].innerHTML = 'Description is required';
        description.parentElement.classList.add('has-error');
        isValid = false;
    }
    else if (description.value.trim().length > description_limit || description.value.trim().length < 10) {
        formerrors[1].innerHTML = 'Description must have min 10 and max 200 characters';
        description.parentElement.classList.add('has-error');
        isValid = false;
    }
    else {
        blogData.blogDescription = description.value;
    }

    // categories validation
    let category = '';
    let isSelected = false;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].checked) {
            isSelected = true;
            category = categories[i].value;
            break;
        }
    }
    if (!isSelected) {
        formerrors[3].innerHTML = 'Category is required';
        isValid = false;
    }
    else {
        blogData.blogCategory = category;
    }

    // quill validation
    if (quill.getText().trim().length === 0) {
        console.log('Quill content is empty');
        isValid = false;
    }
    else {
        let blogContent = quill.root.innerHTML;
        blogData.blogContent = blogContent;
    }

    // image validation
    if (image.files.length === 0 && !blogData.blogImage) {
        formerrors[2].innerHTML = 'Image is required';
        image.parentElement.classList.add('has-error');
        isValid = false;
    }
    else if (image.files.length > 0 && (image.files[0].size / (1024 * 1024)) > 5) {
        formerrors[2].innerHTML = 'Image must be below 5MB';
        image.parentElement.classList.add('has-error');
        isValid = false;
    }

    if (image.files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
            blogData.blogImage = reader.result;
            processBlogData(isValid);
        };
        reader.readAsDataURL(image.files[0]);
    } else {
        processBlogData(isValid);
    }

    return isValid;
}

function processBlogData(isValid) {
    if (isValid) {
        blogData.PublishTime = getCurrentTime();

        let existingBlogData = JSON.parse(localStorage.getItem('BlogData')) || [];

        if (editBlogId !== null) {
            let blogIndex = existingBlogData.findIndex(blog => blog.BlogId === editBlogId);
            if (blogIndex !== -1) {
                existingBlogData[blogIndex] = { ...existingBlogData[blogIndex], ...blogData };
                alert("Blog updated successfully!");
                form_head.textContent = 'Create Post';
            }
        } else {
            let maxBlogId = existingBlogData.length > 0 ? Math.max(...existingBlogData.map(blog => blog.BlogId)) : 0;
            blogData.BlogId = maxBlogId + 1;
            existingBlogData.push(blogData);
            alert("Blog added successfully!");
        }

        localStorage.setItem('BlogData', JSON.stringify(existingBlogData));
        resetForm();
        loadBlogData();
    }
}

function resetForm() {
    form_1.reset();
    form_2.reset();
    imagePreview.style.display = 'none';
    document.querySelector('.textarea-limit').innerHTML = `0/200`
    quill.setContents([]);
    editBlogId = null;
    isEditable = false;
}


// textarea length change
function checkLen(event) {
    let textareaLen = event.target.value;
    let len = textareaLen.length;
    document.querySelector('.textarea-limit').innerHTML = `${len}/200`
}

// clear errors
function clearErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.innerHTML = '';
    });
    document.querySelectorAll('.has-error').forEach(element => {
        element.classList.remove('has-error');
    })
}

//load data in data table

document.addEventListener('DOMContentLoaded', loadBlogData);

function loadBlogData() {
    let blogData = JSON.parse(localStorage.getItem('BlogData')) || [];
    let table_body = document.querySelector('.tbody');
    table_body.innerHTML = '';
    if (blogData.length === 0) {
        table_body.innerHTML = '<tr><td colspan="5">No blogs found</td></tr>';
    }
    blogData.forEach(blog => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${blog.BlogId}</td>
            <td><img src="${blog.blogImage}" width="50px" height="30px"/></td>
            <td>${blog.blogTitle}</td>
            <td>${blog.blogCategory}</td>
            <td>${blog.PublishTime}</td>
            <td>
                <div class="btn-div">
                <button onclick="editBlog(${blog.BlogId})" class="edit-btn">Edit</button>
                <button onclick="deleteBlog(${blog.BlogId})" class="delete-btn">Delete</button>
                </div>
            </td>
        `;
        table_body.appendChild(row);
    });
}

//delete blog

function deleteBlog(blogid) {
    let blogData = JSON.parse(localStorage.getItem('BlogData')) || [];
    const blog_index = blogData.findIndex(blog => blog.BlogId === blogid);
    if (blog_index !== -1) {
        blogData.splice(blog_index, 1)
        localStorage.setItem('BlogData', JSON.stringify(blogData));
        loadBlogData();
    }
    else {
        console.log('Blog not found');
    }
}

// edit blog

function editBlog(blogid) {
    form_head.textContent = 'Edit Post';
    editBlogId = blogid;
    let blogData = JSON.parse(localStorage.getItem('BlogData')) || [];
    const blog_index = blogData.findIndex(blog => blog.BlogId === blogid);
    console.log(blog_index);
    if (blog_index !== -1) {
        const blog = blogData[blog_index];
        title.value = blog.blogTitle;
        description.value = blog.blogDescription;
        document.querySelector('.textarea-limit').innerHTML = `${description.value.length}/200`
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].value === blog.blogCategory) {
                categories[i].checked = true;
                break;
            }
        }
        if (blog.blogImage) {
            imagePreview.innerHTML = `<img src="${blog.blogImage}" alt="Blog Image">`;
        }
        if (typeof quill !== 'undefined') {
            quill.clipboard.dangerouslyPasteHTML(blog.blogContent);
        }

    }
}
