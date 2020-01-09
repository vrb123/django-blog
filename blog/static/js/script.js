
const menu_button = document.querySelector('#menu-toggler-block')
const menu = document.querySelector('.menu-nav')


menu_button.addEventListener('click',  function() {
    this.classList.toggle('change')
    menu.classList.toggle('show')
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



const show_reply_buttons = document.querySelectorAll('.show-replies-button')

const main_detail_container = document.querySelector('.article-detail-container')


for (let button_reply of show_reply_buttons) {
    button_reply.addEventListener('click', function() {
        console.log('clicked')
        const comment_layer = document.getElementsByClassName(this.id)
        comment_layer && comment_layer[0].classList.toggle('show')
    });

}

const comment_block = document.getElementById('comment_block')

const comment_block_title = document.querySelector('.article-comment-form-title')

const comment_author = document.querySelector('.comment-form-author')

const comment_text = document.querySelector('.comment-form-text')




let prev_comment_reply = null

const parent_comment_id = document.getElementById('parent')

const reply_buttons = document.querySelectorAll('.reply-button')

for (let reply_button of reply_buttons) {
    reply_button.addEventListener('click', function() {

        if (prev_comment_reply === this.parentNode.parentNode.parentNode) {
            comment_block_title.innerHTML = 'Your comment'
            parent_comment_id.value = 'none'
            main_detail_container.appendChild(comment_block)
            prev_comment_reply = null
        }
        else {
            const replier_name = this.parentNode
                                        .parentNode
                                        .parentNode
                                        .querySelector('.comment-item-header-author')
                                        .innerHTML
                                        comment_block_title.innerHTML = `Your reply to ${replier_name}\'s comment`
            this.parentNode.parentNode.parentNode.appendChild(comment_block)
            const comment_id = this.parentNode.parentNode.parentNode.classList[1].split('-')[1]
            parent_comment_id.value = comment_id
            prev_comment_reply = this.parentNode.parentNode.parentNode
        }

    });
}


comment_author.oninput = function () {
    document.querySelector('.author-error').innerHTML = ''
    comment_block.classList.remove('error_border')
}

comment_text.oninput = function() {
    document.querySelector('.comment-error').innerHTML = ''
    comment_block.classList.remove('error_border')
}


function appendComment(comment_id, author, text, date, parent) {

    const comment_item = document.createElement('div')
    comment_item.className = `comment-item comment-${comment_id}`

        const comment_header = document.createElement('div')
        comment_header.className = 'comment-item-header'

            const header_author = document.createElement('div')
            header_author.className = 'comment-item-header-author'
            header_author.innerHTML = author

            const header_date = document.createElement('div')
            header_date.className = 'comment-item-header-date'
            header_date.innerHTML = date

        comment_header.appendChild(header_author)
        comment_header.appendChild(header_date)

        comment_item.appendChild(comment_header)

        const comment_body = document.createElement('div')
        comment_body.className = 'comment-item-body'
        comment_body.innerHTML = text

        comment_item.appendChild(comment_body)

        const comment_reply_block = document.createElement('div')
        comment_reply_block.className = 'comment-reply-block'

            const comment_reply_button_block = document.createElement('div')
            comment_reply_button_block.className = 'comment-item-reply-button'

                const reply_button = document.createElement('button')
                reply_button.className = 'reply-button'
                reply_button.innerHTML = 'Reply'

                

                reply_button.addEventListener('click', function() {

                    if (prev_comment_reply === this.parentNode.parentNode.parentNode) {
                        comment_block_title.innerHTML = 'Your comment'
                        parent_comment_id.value = 'none'
                        main_detail_container.appendChild(comment_block)
                        prev_comment_reply = null
                    }
                    else {
                        const replier_name = this.parentNode
                                                    .parentNode
                                                    .parentNode
                                                    .querySelector('.comment-item-header-author')
                                                    .innerHTML
                                                    comment_block_title.innerHTML = `Your reply to ${replier_name}\'s comment`
                        this.parentNode.parentNode.parentNode.appendChild(comment_block)
                        const comment_id = this.parentNode.parentNode.parentNode.classList[1].split('-')[1]
                        parent_comment_id.value = comment_id
                        prev_comment_reply = this.parentNode.parentNode.parentNode
                    }
            
                });

            comment_reply_button_block.appendChild(reply_button)

            comment_reply_block.appendChild(comment_reply_button_block)

            const comment_num_replies_block = document.createElement('div')
            comment_num_replies_block.className = 'comment-item-num-replies'

                const show_replies_button = document.createElement('button')
                show_replies_button.className = 'show-replies-button'
                show_replies_button.id = comment_id
                show_replies_button.innerHTML = `<span class="num-${comment_id}">0</span> replies`

                show_replies_button.addEventListener('click', function() {
                    const comment_layer = document.getElementsByClassName(this.id)
                    comment_layer && comment_layer[0].classList.toggle('show')
                });

            comment_num_replies_block.appendChild(show_replies_button)

            comment_reply_block.appendChild(comment_num_replies_block)
        
        comment_item.appendChild(comment_reply_block)

        const comment_layer_block = document.createElement('div')
        comment_layer_block.className = `comment-layer-block ${comment_id}`

        
        parent && document.getElementsByClassName(parent)[0].classList.add('show')

        comment_item.appendChild(comment_layer_block)


    if( !prev_comment_reply ) {
        document.querySelector('.comment-layer-block-first-layer').appendChild(comment_item)
    }
    else{
        // show-replies-button
        prev_comment_reply.querySelector('.comment-layer-block').appendChild(comment_item)
        prev_comment_reply.querySelector('.show-replies-button span').innerHTML = Number(prev_comment_reply.querySelector('.show-replies-button span').innerHTML) + 1
    }

    comment_author.value = ''
    comment_text.value = ''

}


document.querySelector('.comment-form-submit').addEventListener('click',function(e) {
    e.preventDefault()
    let isFormValid = true

    const author = comment_author.value.trim()
    const text = comment_text.value.trim()
    const article = document.getElementById('article').value
    const parent = document.getElementById('parent').value === 'none' ?
                    null:document.getElementById('parent').value
    // const csrfmiddlewaretoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value

    let csrftoken = getCookie('csrftoken');

    if ( author === ''){
        document.querySelector('.author-error').innerHTML = 'Author name cannot be empty'
        isFormValid = false
    }

    if ( text === '' ) {
        document.querySelector('.comment-error').innerHTML = 'Comment text cannot be empty'
        isFormValid = false
    }

    if (!isFormValid) {
        //comment_block.classList.add('error_border')
    }
    else {
        const body_data = {
            author,
            text,
            parent,
        }

        fetch('post_comment',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(body_data)
        })
            .then(response => {
                return response.json()
            })
            .then(result => {
                console.log(result)
                console.log(prev_comment_reply)
                appendComment(result.pk, author, text, result.date_of_publish, parent)
            })
            .catch(err => {
                console.log(err)
            })
    }

});