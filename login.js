(function() {
    
    // Initialize Firebase
    var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        storageBucket: "",
        messagingSenderId: ""
    };
    firebase.initializeApp(config);

    //Get Elements
    const txtFName = document.getElementById('txtFName');
    const txtLName = document.getElementById('txtLName');
    const txtUserName = document.getElementById('txtUserName');
    const txtCompany = document.getElementById('txtCompany');
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogIn = document.getElementById('btnLogIn');
    const btnSignUp = document.getElementById('btnSignUp');
    const btnLogOut = document.getElementById('btnLogOut');
    const btnProfileSave = document.getElementById('btnProfileSave');
    const btnDashToGo= document.getElementById('btnDashToGo');
    var signup=false, login=false, save=false;
    var signupEmail='', signupUID='';
    $('#userDashboardRedirect').hide();
    

    if(btnLogIn!=null){
        // Add Login event
        btnLogIn.addEventListener('click', e => {
        	
        	//Get Email and Pass
        	const email= txtEmail.value;
        	const pass= txtPassword.value;
        	const auth= firebase.auth();

        	//Sign In
        	const promise = auth.signInWithEmailAndPassword(email,pass);
        	promise.catch(e => {
                var errorMessage= e.message;
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var data = {message: errorMessage};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
                });
            signup=false;
            login=true;
            save=false;
        });
    }
	
    if(btnSignUp!=null)
    {
        // Add Signup Event
        btnSignUp.addEventListener('click', e => {
        	
        	//Get Email and Pass
        	const email= txtEmail.value;
        	const pass= txtPassword.value;
        	const auth= firebase.auth();

        	if(validateEmail(email))
        	{
        		//Sign In
        		const promise = auth.createUserWithEmailAndPassword(email,pass);
        		promise.catch(e => {
                var errorMessage= e.message;
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var data = {message: errorMessage};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
                });

                signup=true;
                login=false;
                save=false;
        	}
        	else
        	{
                var snackbarContainer = document.querySelector('#demo-toast-example');
                var data = {message: 'Invalid Email'};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
        	}
        });
    }


    if(btnProfileSave!=null)
    {
        btnProfileSave.addEventListener('click', e => {
        
            //Get profile fields
            const fName= txtFName.value;
            const lName= txtLName.value;
            const userName= txtUserName.value;
            const company= txtCompany.value;
            const role= $('input[name="options"]:checked').val();

            try{

                if(!isEmpty(fName) && !isEmpty(lName) && !isEmpty(userName) && !isEmpty(company) && role!= null)
                {
                    try{
                        var postData = {
                            Email: signupEmail,
                            UID: signupUID,
                            firstName: fName,
                            lastName: lName,
                            Role: role,
                            Company: company,
                            userName: userName
                        };
                        // Write the new post's data simultaneously in the posts list and the user's post list.
                        var updates = {};
                        updates['/Users/' + signupUID] = postData;
                        firebase.database().ref().update(updates);
                        $('#userDashboardRedirect').show();
                        $('#userProfileCard').hide();
                    }
                    catch(error){
                        var errorMessage= error.message;
                        console.log(errorMessage);
                    }
                }
                else{
                    console.log('pranjal snackbarContainer');
                    var snackbarContainer = document.querySelector('#demo-toast-example');
                    var data = {message: 'Empty Field Detected'};
                    snackbarContainer.MaterialSnackbar.showSnackbar(data);
                }
            }
            catch(error){
                var errorMessage= error.message;
                console.log(errorMessage);
            }
        });
    }

    if(btnDashToGo!=null)
    {
        btnDashToGo.addEventListener('click', e => {
            window.open('dashboard.html','_self',false);
        });  
    }


    // Add a realtime login listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
    	if(firebaseUser){
            signupEmail= firebaseUser.email;
            signupUID= firebaseUser.uid;

            if(signup)
            {
                window.open('profile.html','_self',false);
            }
            else if(login)
            {
                window.open('dashboard.html','_self',false);
            }
        }
        else{
            
    		//console.log('User not logged in');
    	}

    });


    function validateEmail(email) 
	{
    	var re = /\S+@\S+\.\S+/;
    	return re.test(email);
	}

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

}());


