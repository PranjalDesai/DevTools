(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDTYxOvNttW9scHzpTN2bWe2S0oQ86iap8",
        authDomain: "devtools-73ed5.firebaseapp.com",
        databaseURL: "https://devtools-73ed5.firebaseio.com",
        storageBucket: "devtools-73ed5.appspot.com",
        messagingSenderId: "146302750750"
    };
    firebase.initializeApp(config);

    const btnLogOut = document.getElementById('btnLogOut');
    const btnDashboard = document.getElementById('btnDashboard');
    const btnProfile = document.getElementById('btnProfile');
    const btnAdd = document.getElementById('newStory');
    const btnCancel = document.getElementById('btnCancel');
    const txtUSName= document.getElementById('txtUSName');
    const txtUSDescription= document.getElementById('txtUSDescription');
    const btnSubmit = document.getElementById('btnSubmit');
    $('#materialCancel').hide();
    $('#AddStory').hide();
    $('#AddSprint').hide();

    var uid, userEmail, projectID, sprintID, poRef, detailsRef, spdetailsRef, sprintName, projectDescription, sprintDuration;


    btnAdd.addEventListener('click', e =>{
        $('#materialCancel').show();
        $('#AddStory').show();
        $('#SprintDetails').hide();
    });

    btnCancel.addEventListener('click', e =>{
        $('#materialCancel').hide();
        $('#AddStory').hide();
        $('#SprintDetails').show();
    });

    btnLogOut.addEventListener('click', e =>{
        firebase.auth().signOut();
        window.open('index.html','_self',false);
    });

    btnDashboard.addEventListener('click', e =>{
        window.open('dashboard.html','_self',false);
    });

    btnProfile.addEventListener('click', e =>{
        window.open('profile.html','_self',false);
    });

        // Add a realtime login listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
           uid= firebaseUser.uid;
           userEmail= firebaseUser.email;
           $('#navigationTitle').append(userEmail);
           poCheck();
           getProjectID();
           getSprintID();
           getTasks();
           getUserStories();
           getSprintProjectDetails();
        }else{
            window.open('index.html','_self',false);
            //console.log('user not found');
        }

    });

    function poCheck(){
        poRef = firebase.database().ref('Users/'+uid);
        poRef.on('value', function(data) {
                role=data.val().Role;
                roleFinder(role);
        });
    }

    function roleFinder(role)
    {
        var comp= 'Product Owner';
        var comp2= 'Scrum Master';
        //console.log(role);
        try{
            if(role.localeCompare(comp)!=0 && role.localeCompare(comp2)!=0){
                $('#newStory').hide();
            }
        }catch(err)
        {
            console.log(err);
        }
    }

    function getSprintProjectDetails(){
        detailsRef = firebase.database().ref('Projects/'+projectID);
        detailsRef.on('value', function(data) {
            projectDescription=data.val().projDescription;
        });
        spdetailsRef =firebase.database().ref('Sprints/'+sprintID);
        spdetailsRef .on('value', function(data) {
            sprintName=data.val().sprintName;
            sprintDuration= data.val().sprintDuration;
            try{
                if(projectID.localeCompare('undefined')==0)
                {
                    projectID= data.val().projectID;
                }
            }catch(err)
            {
                console.log(err);
            }
            detailAdder(sprintName, projectDescription, sprintDuration);
        });

    }

    function detailAdder(sprintName, projectDescription, sprintDuration){
        try{
            var row="   <span>Sprint Name: "+sprintName+"</span><br>\
                        <span>Sprint Duration: "+sprintDuration+" weeks</span><br>\
                        <span>Project-Description: "+projectDescription+"</span><br>";
           $('#SprintDescription').append(row);
           $('#sprintNames').text(sprintName);
           //console.log(sprintName);
        }
        catch(error){
            console.log(error);
        }

    }

    function getProjectID()
    {

        if (typeof(Storage) !== "undefined") {
            projectID= localStorage.getItem("pID");
        } else {
            //projectID = "Sorry, your browser does not support Web Storage...";
        }
        //console.log(projectID);
    }

    function getSprintID(){

        if (typeof(Storage) !== "undefined") {
            sprintID= localStorage.getItem("sprintID");
        } else {
            //projectID = "Sorry, your browser does not support Web Storage...";
        }
        //console.log(sprintID);

    }

    btnSubmit.addEventListener('click', e => {

        const UserStoryName= txtUSName.value;
        const UserStoryDescription= txtUSDescription.value;

        if(UserStoryName == null && UserStoryDescription== null)
        {
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Missing Fields'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
        else
        {
            // Get a key for a new Post.
            var UserStoryID = firebase.database().ref().child('UserStories').push().key;

            var postData = {
                sprintID: sprintID,
                projectID: projectID,
                UserStoryID: UserStoryID,
                UserStoryName: UserStoryName,
                UserStoryDescription: UserStoryDescription,
            };

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/UserStories/' + UserStoryID] = postData;

            firebase.database().ref().update(updates);

            $('#materialCancel').hide();
            $('#AddStory').hide();
            $('#SprintDetails').show();
            txtUSName.value = "";
            txtUSDescription.value = "";
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'UserStory Created :)'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    });

    function getTasks(){
        var taskRef = firebase.database().ref('Tasks/');
        taskRef.on('child_added', function(data) {
            try{
                if(data.val().sprintID.localeCompare(sprintID)==0)
                {
                    addTaskHTML(data.val().taskName, data.val().taskAssigned, data.val().taskID);
                }
            }catch(err)
            {
                console.log(err);
            }
        });
    }
    /*function getTasks(){
        var taskRef = firebase.database().ref('Tasks/');
        //console.log('here111');
        taskRef.on('child_added', function(data) {
            try{
                if(data.val().taskAssigned.localeCompare(userEmail)==0)
                {
                    //console.log('here222'+data.val().taskID);
                    var x= parseInt(data.val().taskDuration) - parseInt(data.val().taskCompleted);
                    addTaskHTML(data.val().taskName, x, data.val().taskID, data.val().taskStatus);   
                }
            }catch(err)
            {
                console.log(err);
            }
        });
    }*/


    function addTaskHTML(name, assigned, id){
        ////console.log(name+" "+ time);
        var row= "<tr>\
                    <th class=\"mdl-data-table__cell--non-numeric\">"+name+"</th>\
                    <th class=\"mdl-data-table__cell--non-numeric\">"+assigned+"</th>\
                    <th class=\"mdl-data-table__cell--non-numeric\"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"taskLink\">Link</button></th>\
                    <input type=\"hidden\" name=\"taskID\" class=\"taskID\" value="+id+">\
                </tr>";
        $('#TaskData').append(row);
    }

    function getUserStories(){
        var usRef = firebase.database().ref('UserStories/');
        usRef.on('child_added', function(data) {
            try{
                if(data.val().sprintID.localeCompare(sprintID)==0)
                {
                    addUSHTML(data.val().UserStoryName, data.val().UserStoryID);
                }
            }catch(err)
            {
                console.log(err);
            }
        });
    }


    function addUSHTML(name, id){
        ////console.log(name+" "+ time);
        var row= "<tr>\
                    <th class=\"mdl-data-table__cell--non-numeric\">"+name+"</th>\
                    <th class=\"mdl-data-table__cell--non-numeric\"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"usLink\">Link</button></th>\
                    <input type=\"hidden\" name=\"sprintID\" class=\"usID\" value="+id+">\
                </tr>";
        $('#UserStoryData').append(row);
    }

    $(document).on('click', '#usLink', function(){
        var sendUSID= $('input[type=hidden]', $(this).closest("tr")).val();

        if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.setItem("usID", sendUSID);
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
        window.open('userstory.html','_self',false);

    });

    $(document).on('click', '#taskLink', function(){
        var sendTaskID= $('input[type=hidden]', $(this).closest("tr")).val();

        if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.setItem("taskID", sendTaskID);
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
        window.open('task.html','_self',false);

    });


}());
