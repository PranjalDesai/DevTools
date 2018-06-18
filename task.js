// Task Javascript goes here

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
    const txtTaskDuration= document.getElementById('txtTaskDuration');
    const btnUpdate = document.getElementById('btnUpdate');
    var uid, userEmail, projectID, sprintID, userstoryID,taskID, detailsRef, taskDescription, taskName, taskDuration, taskCompleted, taskUser;

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
           getTaskID();
           getTaskDetails();
        }else{
            window.open('index.html','_self',false);
            //console.log('user not found');
        }

    });

    function getTaskDetails(){
        //console.log(taskID+"Pranjal");
        detailsRef = firebase.database().ref('Tasks/'+taskID);
        detailsRef.on('value', function(data) {
            taskDescription= data.val().taskDescription;
            //console.log(taskDescription)
            taskName= data.val().taskName;
            taskDuration= data.val().taskDuration;
            taskCompleted= data.val().taskCompleted;
            taskUser= data.val().taskAssigned;
            projectID= data.val().projectID;
            try{
                if(projectID.localeCompare('undefined')==0)
                {
                    sprintID= data.val().sprintID;
                    userstoryID= data.val().UserStoryID;
                }
            }catch(err)
            {
                console.log(err);
            }
            detailAdder(taskName, taskDescription, taskDuration, taskCompleted);
        });

    }

    function detailAdder(taskName, taskDescription, taskDuration, taskCompleted){
        try{
            var x= parseInt(taskDuration)-parseInt(taskCompleted);
            var row="<span>Task Name: "+taskName+"</span><br>\
            <span>Total Time: "+taskDuration+" hrs</span><br>\
            <span>Time Left: "+x+" hrs</span><br>\
            <span>Task Description: "+taskDescription+"</span><br>";
           $('#TaskDescription').append(row);
           $('#TaskNames').text(taskName);
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

    function getTaskID(){

        if (typeof(Storage) !== "undefined") {
            taskID= localStorage.getItem("tID");
        } else {
            //projectID = "Sorry, your browser does not support Web Storage...";
        }
        //console.log(sprintID);

    }


    btnUpdate.addEventListener('click', e => {

        const TaskUpdate= txtTaskDuration.value;


        if(TaskUpdate == null)
        {
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Missing Fields'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
        else
        {
            var x= parseInt(taskCompleted)+parseInt(TaskUpdate);
            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['Tasks/' + taskID+'/taskCompleted'] = x;

            firebase.database().ref().update(updates);

            txtTaskDuration.value = "";
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Task Updated :)'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
            window.open('task.html','_self',false);

        }
    });


}());
