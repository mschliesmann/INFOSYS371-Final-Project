//Signing Up Users
    let signup_form = document.querySelector('#signup_form');
    let signupbtn = document.querySelector('#signupbtn');

    // Attach an event
    signupbtn.addEventListener('click', (e) => {
        e.preventDefault();

        // grab the email and password
        let email = document.querySelector('#email').value;
        let password = document.querySelector('#password').value;

        // pass the values to firebase

        // sign up the user

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
            console.log('user created successfully');
            // reset the form
            signup_form.reset();
            })
            .catch((error) => {
                let signup_error = document.querySelector('#signup_error');
                signup_error.innerHTML = `<p>${error.message}</p>`;
            });
    })

// Signing In Users
    let signin_form = document.querySelector('#signin_form');
    let signinbtn = document.querySelector('#signinbtn');

    // attach a submit event on the form
    signinbtn.addEventListener('click', (e) => {
        e.preventDefault();

        // grab the email and password from the form

        let email = document.querySelector('#email_').value;
        let password = document.querySelector('#password_').value;


        auth.signInWithEmailAndPassword(email, password)
        .then((userCredentials) => {
            console.log(userCredentials.user.email + " with the uid " + userCredentials.user.uid + " is logged in!")
            // reset 
            signin_form.reset();
        })
        .catch((error) => {
            console.log(error.message);
            // grab the error div
            let signin_error = document.querySelector('#signin_error');
            signin_error.innerHTML = `<p>${error.message}</p>`
        })
    })

// Signing Out Users
    let signoutbtn = document.querySelector('#signoutbtn');

    // attach a click event
    signoutbtn.addEventListener('click', () => {
        auth.signOut()
            .then((msg) => {
            console.log("user signed out!");
        })
    })

// Keeping track of user authentication status (signed in or signed out)
auth.onAuthStateChanged((user) => {
    //check if user is signed in or signed out
    if(user) {
      console.log('user is now signed in!')
      configureNav(user);
      configureContent(user);
    }
    else {
      console.log('user is now signed out!')
      configureNav();
      configureContent(user);
    }
  })


//Toggling Nav Bar
    let loggedoutlinks = document.querySelectorAll('.loggedout');
    let loggedinlinks = document.querySelectorAll('.loggedin');

    // Functions
    function configureNav(user) {
        //check if user is passed to the function - user is signed in
        if (user) {
            //show only the logged in links
            loggedinlinks.forEach((link) => {
                link.classList.remove('is-hidden'); //if there is any is-hidden class on the button, remove it
            })
  
            //hide all the logged out links
            loggedoutlinks.forEach((link) => {
                link.classList.add('is-hidden'); //add an is-hidden class on the button to hide it
            })
        }
        //no user is passed to the function - user is signed out
        else {
            //show only the logged out links
            loggedoutlinks.forEach((link) => {
                link.classList.remove('is-hidden');
            })
            //hide all the logged in links
            loggedinlinks.forEach((link) => {
                link.classList.add('is-hidden');
            })
        }
    }

// Configuring Content
    function configureContent(user) {

        //check if user is signed in (passed to the function)
        if (user) {
        //retrieve data from firebase
            db.collection('postings').where('email', '==', auth.currentUser.email).get().then((data) => {
        
                //mydata is an array of the data
                let mydata = data.docs;
        
                //empty the content div
                exploreartists.classList.remove('is-active');
                exploreartists.classList.add('is-hidden');
                shop.classList.remove('is-active');
                shop.classList.add('is-hidden');
                main.classList.remove('is-active');
                main.classList.add('is-hidden');
                main_tabs.classList.remove('is-active');
                main_tabs.classList.add('is-hidden');
                content.classList.add('is-active');
                content.classList.remove('is-hidden');
        
                //loop through the array
                mydata.forEach((item) => {
                    content.innerHTML += `
                    <div class="box">
                        <h1 class="title is-size-3 has-background-success-light p-2">${item.data().title}</h1>
                        <h1 class="title is-size-6 has-background-success-light p-2">
                            <p><i><b>By: ${item.data().email}</b></i></p>
                            <p><i>${item.data().type}</i></p>
                        </h1>
                        <p>${item.data().desc}</p>
                        <p class="m-2"><img width="200" src="${item.data().url}"/></p>
                    </div>
                    `;
                })
            })
        }
        //user is not signed in (not passed to the function)
        else {
            main.classList.remove('is-hidden');
            main.classList.add('is-active');
            main_tabs.classList.remove('is-hidden');
            main_tabs.classList.add('is-active');
            shop.classList.remove('is-active');
            shop.classList.add('is-hidden');
            exploreartists.classList.remove('is-active');
            exploreartists.classList.add('is-hidden');
            content.classList.add('is-hidden');
            content.classList.remove('is-active');
            submitpostingform.innerHTML = "";
        }
    }


// Main Content Tabs
    let tab1 = document.querySelector('.tab1');
    let tab2 = document.querySelector('.tab2');     
    let tab3 = document.querySelector('.tab3');  
    let tabp1 = document.querySelector('.tabp1');
    let tabp2 = document.querySelector('.tabp2');     
    let tabp3 = document.querySelector('.tabp3');  

    tab1.addEventListener('click', () => {
        tab1.classList.remove('is-hidden');
        tab1.classList.add('is-active');
        tab2.classList.remove('is-active');
        tab3.classList.remove('is-active');
        tabp1.classList.remove('is-hidden');
        tabp1.classList.add('is-active');
        tabp2.classList.add('is-hidden');
        tabp3.classList.add('is-hidden');
        
    })

    tab2.addEventListener('click', () => {
        tab2.classList.add('is-active');
        tab1.classList.remove('is-active');
        tabp2.classList.remove('is-hidden');
        tabp2.classList.add('is-active');
        tabp3.classList.add('is-hidden');
        tabp1.classList.add('is-hidden');

    })

    tab3.addEventListener('click', () => {
        tab3.classList.add('is-active');
        tab2.classList.remove('is-active');
        tab1.classList.remove('is-active');
        tabp3.classList.remove('is-hidden');
        tabp3.classList.add('is-active');
        tabp2.classList.add('is-hidden');
        tabp1.classList.add('is-hidden');

    })

// Posting a Listing on Sell

    let sell_tag = document.querySelector("#sell_tag");
    let main = document.querySelector('#main');
    let html = '<h1 class="title is-3 has-text-centered has-background-danger has-text-white mr-6 ml-6 p-5" style="border-radius: 25px;">Post a Listing</h1>';
    html += `

    <div class="columns has-background-danger-light is-centered m-6 mt-3 p-6" style="border-radius: 25px;">
            <div class="column is-danger m-4">
            <div class = "field" >
                <label class = "label" > Title </label> 
                <div class = "control" >
                <input class = "input is-danger" type = "text" id="art_title" placeholder = "Choose a unique and descriptive title for your piece" >
                </div> 
            </div>
            <div class = "field" >
                <label class = "label" > Type </label> 
                <div class = "control" >
                <input class = "input is-danger" type = "text" id="art_type" placeholder = "Art & Media, Clothing, or Jewelry & Accessories" >
                </div> 
            </div>

            <div class="field">
                <label class="label">Price</label>
                <div class="control">
                <textarea class="textarea is-danger" placeholder="Price" id="art_price"></textarea>
                </div>
            </div>

            <div class="field">
                <label class="label">Description</label>
                <div class="control">
                <textarea class="textarea is-danger" placeholder="Description" id="art_description"></textarea>
                </div>
            </div>

            <div class="field">
            <label class="label">Image</label>
            <div class="control">
            <input class = "input is-danger" type = "file" id="art_image" placeholder = "Choose an image">
            </div>
            </div>
            
            <div class="field is-grouped">
            <div class="control">
                <button id= "submitPosting" class="button is-danger mt-4">Submit</button>
            </div>
            </div>
        </div>
    </div>

    `;
    let submitpostingform = document.querySelector('#submitpostingform');
    sell_tag.addEventListener('click', () => {
        content.innerHTML = "";
        shop.classList.add('is-hidden');
        shop.classList.remove('is-active');
        submitpostingform.classList.remove('is-hidden');
        submitpostingform.classList.add('is-active');
        submitpostingform.innerHTML = html;
    })

//Storing posting details in Firebase
    submitpostingform.addEventListener('submit', (e) => {
        e.preventDefault();
    
        //grab the recipe title
        let art_title = document.querySelector('#art_title').value;
        let art_type = document.querySelector('#art_type').value;
        let art_price = document.querySelector('#art_price').value;
        let art_description = document.querySelector('#art_description').value;
    
        //upload image to firebase
        let file = document.querySelector('#art_image').files[0];
        let image = new Date() + "_" + file.name;
        const task = ref.child(image).put(file);

        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then((url) => {
            //combine title and description into one object
            let posting_details = {
                title: art_title,
                type: art_type,
                price: art_price,
                desc: art_description,
                email: auth.currentUser.email,
                url: url             
            }
        
            //add recipe details into firebase
            db.collection('postings').add(posting_details).then((data) => {   
                //1. reset the form
                submitpostingform.reset();
                    
                //2. display a success message for the user
                alert('Posting successfully submited!');
            })
        })
    })

// Shopping the Site
    let shop_tag = document.querySelector('#shop_tag');

    shop_tag.addEventListener('click', (e) => {
        exploreartists.classList.remove('is-active');
        exploreartists.classList.add('is-hidden');
        shop.classList.remove('is-hidden');
        shop.classList.add('is-active');
        content.innerHTML = "";
        submitpostingform.classList.add('is-hidden');
        submitpostingform.classList.remove('is-active');
        main.classList.add('is-hidden');
        main.classList.remove('is-active');
        main_tabs.classList.add('is-hidden');
        main_tabs.classList.remove('is-active');
        

        db.collection('postings').get().then((data) => {
            let mydata = data.docs;
            let posts = document.querySelector('#posts');

            posts.innerHTML = `<h1 class="title is-3 has-text-centered has-background-danger has-text-white p-5" style="border-radius: 15px;">Shop the Art</h1>`;
      
            //loop through the array
            mydata.forEach((item) => {
              posts.innerHTML += `
              <div class="box">
                    <h1 class="title is-size-3 has-background-success-light p-2">${item.data().title}</h1>
                    <h1 class="title is-size-6 has-background-success-light p-2">
                        <p><i><b>By: ${item.data().email}</b></i></p>
                        <p><i><b>$${item.data().price}</b></i></p>
                        <p><i>${item.data().type}</i></p>
                    </h1>
                    <p>${item.data().desc}</p>
                    <p class="m-2"><img width="200" src="${item.data().url}"/></p>
                </div>
                `;
            })
        })
    })

    // Searching the site
    let search_button = document.querySelector('#search_button');

    //attach a click event
    search_button.addEventListener('click', () => {
        //1. grab the content of the input with id search_box
        let search_box = document.querySelector('#search_box').value;

        //grab customized data from firebase
        db.collection('postings').where('type', '==', search_box).get().then((data) => {
            //mydata is an array of the data
            let mydata = data.docs;

            //empty the posts div
            posts.innerHTML = "";

             //loop through the array
            mydata.forEach((item) => {
            posts.innerHTML += `
                <div class="box">
                    <h1 class="title is-size-3 has-background-success-light p-2">${item.data().title}</h1>
                    <h1 class="title is-size-6 has-background-success-light p-2">
                        <p><i><b>By: ${item.data().email}</b></i></p>
                        <p><i><b>$${item.data().price}</b></i></p>
                        <p><i>${item.data().type}</i></p>
                    </h1>
                    <p>${item.data().desc}</p>
                    <p class="m-2"><img width="200" src="${item.data().url}"/></p>
                </div>
                `;
            })
        })
    })

// Exploring Artists
    let artists_tag = document.querySelector('#artists_tag');

    artists_tag.addEventListener('click', (e) => {
        main.innerHTML = "";
        main_tabs.innerHTML = "";
        shop.classList.remove('is-active');
        shop.classList.add('is-hidden');
        exploreartists.classList.remove('is-hidden');
        exploreartists.classList.add('is-active');

        db.collection('postings').get().then((data) => {
            let mydata = data.docs;
            let artists = document.querySelector('#artists');

            artists.innerHTML = `<h1 class="title is-3 has-text-centered has-background-danger has-text-white p-5" id = "artist_head" style="border-radius: 25px;">Shop Your Favorite Artists</h1>`;
      
            //loop through the array
            mydata.forEach((item) => {
              artists.innerHTML += `
              <div class="box">
                    <h1 class="title is-size-3 has-background-success-light p-2">${item.data().email}</h1>
                    <h1 class="title is-size-6 has-background-success-light p-2">
                        <p><i>${item.data().title}</i></p>
                        <p><i>${item.data().type}</i></p>
                        <p><i>$${item.data().price}</i></p>
                    </h1>
                    <p>${item.data().desc}</p>
                    <p class="m-2"><img width="200" src="${item.data().url}"/></p>
                </div>
                `;
            })
        })
    })

    // Searching the site
    let search_button2 = document.querySelector('#search_button_');

    //attach a click event
    search_button2.addEventListener('click', () => {
        //1. grab the content of the input with id search_box
        let search_box_ = document.querySelector('#search_box_').value;

        //grab customized data from firebase
        db.collection('postings').where('email', '==', search_box_).get().then((data) => {
            //mydata is an array of the data
            let mydata = data.docs;

            //empty the posts div
            artists.innerHTML = "";

            //loop through the array
            mydata.forEach((item) => {
            artists.innerHTML += `
                <div class="box">
                    <h1 class="title is-size-3 has-background-success-light p-2">${item.data().email}</h1>
                    <h1 class="title is-size-6 has-background-success-light p-2">
                        <p><i>${item.data().title}</i></p>
                        <p><i>${item.data().type}</i></p>
                        <p><i>$${item.data().price}</i></p>
                    </h1>
                     <p>${item.data().desc}</p>
                    <p class="m-2"><img width="200" src="${item.data().url}"/></p>
                </div>
                `;
            })
        })
    })

//Adding a Blog Post
let submit_blog = document.querySelector('#submit_blog');
let blog_form = document.querySelector('#blog_form');

    //Add Event Listener
    blog_form.addEventListener('submit', (e) => {
        e.preventDefault();

        //Grab details
        let blog_name = document.querySelector('#blog_name');
        let blog_text = document.querySelector('#blog_text');

        let blog_name1 = document.querySelector('#blog_name').value;
        let blog_text1 = document.querySelector('#blog_text').value;

        //combine title and description into one object
        let blog_details = {
            name: blog_name1,
            text: blog_text1,          
        }
    
        //add blog details into firebase
        db.collection('blogs').add(blog_details).then((data) => {   
            //1. reset the form
            blog_form.reset();
                
            //2. display a success message for the user
            alert('Blog post successfully submited!');
        })

        db.collection('blogs').get().then((data) => {
            let mydata = data.docs;
            let blog_posts = document.querySelector('#blog_posts');
      
            //loop through the array
            mydata.forEach((item) => {
            blog_posts.innerHTML += `
              <div class="box">
                    <h1 class="title is-size-6 has-background-danger-light p-2">${item.data().name}</h1>
                    <p>${item.data().text}</p>
                </div>
                `;
            })
        })
    
    })

//Adding a Review
let review_form = document.querySelector('#review_form');

    //Add Event Listener
    review_form.addEventListener('submit', (e) => {
        e.preventDefault();

        //Grab details
        let review_name = document.querySelector('#review_name');
        let review_text = document.querySelector('#review_text');

        let review_name1 = document.querySelector('#review_name').value;
        let review_text1 = document.querySelector('#review_text').value;

        //combine title and description into one object
        let review_details = {
            name: review_name1,
            text: review_text1,          
        }
    
        //add blog details into firebase
        db.collection('reviews').add(review_details).then((data) => {   
            //1. reset the form
            review_form.reset();
                
            //2. display a success message for the user
            alert('Review successfully submited!');
        })

        db.collection('reviews').get().then((data) => {
            let mydata = data.docs;
            let review_posts = document.querySelector('#review_posts');
      
            //loop through the array
            mydata.forEach((item) => {
            review_posts.innerHTML += `
              <div class="box">
                    <h1 class="title is-size-6 has-background-danger-light p-2">${item.data().name}</h1>
                    <p>${item.data().text}</p>
                </div>
                `;
            })
        })
    
    })



