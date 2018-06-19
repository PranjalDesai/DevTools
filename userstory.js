// Story Javascript goes here

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
    const btnAdd = document.getElementById('newTask');
    const btnCancel = document.getElementById('btnCancel');
    const txtTaskName= document.getElementById('txtTASKName');
    const txtTaskUser= document.getElementById('txtTASKUser');
    const txtTaskDuration= document.getElementById('txtTASKDuration');
    const txtTaskDescription= document.getElementById('txtTASKDescription');
    const btnSubmit = document.getElementById('btnSubmitTask');
    $('#AddTask').hide();

    var uid, userEmail, projectID, sprintID, userstoryID, poRef, detailsRef, usDescription, usName;


    btnAdd.addEventListener('click', e =>{
        $('#AddTask').show();
        $('#USDetails').hide();
    });

    btnCancel.addEventListener('click', e =>{
        $('#AddTask').hide();
        $('#USDetails').show();
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
           getProjectID();
           getSprintID();
           getUSID();
           getTasks();
           getUSDetails();
        }else{
            window.open('index.html','_self',false);
            //console.log('user not found');
        }

    });

    function getUSDetails(){
        detailsRef = firebase.database().ref('UserStories/'+userstoryID);
        console.log(userstoryID)
        detailsRef.on('value', function(data) {
            usDescription=data.val().UserStoryDescription;
            usName=data.val().UserStoryName;
            try{
                if(projectID.localeCompare('undefined')==0 || sprintID.localeCompare('undefined')==0)
                {
                    projectID= data.val().projectID;
                    sprintID= data.val().sprintID;
                }
            }catch(err){
                console.log(err);
            }
            detailAdder(usName, usDescription);
        });

    }

    function detailAdder(usName, usDescription){
        try{
            var row="<span>"+usDescription+"</span><br>";
           $('#USDescription').append(row);
           $('#USNames').text(usName);
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
    function getUSID(){

        if (typeof(Storage) !== "undefined") {
            userstoryID= localStorage.getItem("usID");
        } else {
            //projectID = "Sorry, your browser does not support Web Storage...";
        }
        //console.log(sprintID);

    }

    btnSubmitTask.addEventListener('click', e => {

        const TaskName= txtTaskName.value;
        const TaskDescription= txtTaskDescription.value;
        const TaskUser= txtTaskUser.value;
        const TaskDuration=txtTaskDuration.value;

        if(TaskName == null && TaskDuration== null && TaskDescription== null && TaskUser== null)
        {
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Missing Fields'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
        else
        {
            // Get a key for a new Post.
            var taskID = firebase.database().ref().child('Tasks').push().key;

            var postData = {
                sprintID: sprintID,
                projectID: projectID,
                UserStoryID: userstoryID,
                taskID: taskID,
                taskName: TaskName,
                taskDuration: TaskDuration,
                taskDescription: TaskDescription,
                taskAssigned: TaskUser,
                taskDuration: TaskDuration,
                taskStatus: "BackLog",
                taskCompleted: 0,
            };

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/Tasks/' + taskID] = postData;

            firebase.database().ref().update(updates);

            $('#AddTask').hide();
            $('#USDetails').show();
            txtTaskName.value = "";
            txtTaskDescription.value = "";
            txtTaskUser.value="";
            txtTaskDuration.value="";
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Task Created :)'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    });

    function getTasks(){
        var taskRef = firebase.database().ref('Tasks/');
        taskRef.on('child_added', function(data) {
            try{
                if(data.val().UserStoryID.localeCompare(userstoryID)==0)
                {
                    addTaskHTML(data.val().taskName, data.val().taskAssigned, data.val().taskID);
                }
            }catch(err)
            {
                console.log(err);
            }
        });
    }

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
