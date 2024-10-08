// main page code
let cards = document.querySelector('.cards');
let existingBlogData = JSON.parse(localStorage.getItem('BlogData')) || [];
displayBlogs(existingBlogData);

// display cards function
function displayBlogs(BlogData) {
    BlogData.map((blogdata) => {
        let card = document.createElement('div');
        card.className = 'card';

        let card_img = document.createElement('div');
        card_img.className = 'card-img';

        let card_text = document.createElement('div');
        card_text.className = 'card-text';

        let card_footer = document.createElement('div');
        card_footer.className = 'card-footer';

        let img = document.createElement('img');

        if (blogdata.blogImage) {
            img.src = blogdata.blogImage;
        } else {
            img.alt = 'Image not available';
        }
        card_img.appendChild(img);

        let link = document.createElement('a');
        link.textContent = blogdata.blogTitle;
        link.href = `blog_view.html?id=${blogdata.BlogId}`;
        link.id = 'view_blog';
        link.target = '_blank';
        card_text.appendChild(link);

        let description = document.createElement('p');
        description.textContent = blogdata.blogDescription;
        card_text.appendChild(description);

        let publishTime = document.createElement('p');
        if (blogdata.PublishTime) {
            publishTime.textContent = `Published on: ${blogdata.PublishTime}`;
        } else {
            publishTime.textContent = 'Publish time not available';
        }
        card_footer.appendChild(publishTime);

        card.appendChild(card_img);
        card.appendChild(card_text);
        card.appendChild(card_footer);

        cards.appendChild(card);

    })
}

// apply filters

function applyFilters() {
    const selectedFilters = Array.from(document.querySelectorAll('#filterOptions input[type="checkbox"]:checked')).map(checkBox => checkBox.value);
    let blogData = JSON.parse(localStorage.getItem('BlogData')) || [];
    let cards = document.querySelector('.cards');
    if (selectedFilters.length > 0) {
        cards.innerHTML = '';
        let filterBlogs = blogData.filter(blog => selectedFilters.includes(blog.blogCategory));

        if (filterBlogs.length > 0) {
            displayBlogs(filterBlogs);
        }
        else {
            cards.innerHTML = '<p>No blogs found for the selected filters</p>';
            console.log(filterBlogs.length);
        }
    }
    else {
        cards.innerHTML = '';
        displayBlogs(blogData);
    }
}

// search input

document.querySelector('.search-btn').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    let blogData = JSON.parse(localStorage.getItem('BlogData')) || [];
    let cards = document.querySelector('.cards');
    if (query.length > 0) {
        cards.innerHTML = '';
        const filteredBlogs = blogData.filter(blog =>
            blog.blogTitle.toLowerCase().includes(query) ||
            blog.blogDescription.toLowerCase().includes(query) ||
            blog.blogCategory.toLowerCase().includes(query)
        );
        if (filteredBlogs.length > 0) {
            displayBlogs(filteredBlogs);
        }
        else {
            cards.innerHTML = '<p>No blogs found your search results</p>';
        }

    }
    else {
        cards.innerHTML = '';
        displayBlogs(blogData);
    }

})




