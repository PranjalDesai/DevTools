(function(){

    // Initialize Firebase
    var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        storageBucket: "",
        messagingSenderId: ""
    };
    firebase.initializeApp(config);

    const btnLogOut = document.getElementById('btnLogOut');
    const btnDashboard = document.getElementById('btnDashboard');
    const btnProfile = document.getElementById('btnProfile');
    const btnMessageClick = document.getElementById('MessageClick');
    const btnMessageClose =document.getElementById('messageClose');
    const btnMessageSend = document.getElementById('messageSend');
    const btnMaterialUpload = document.getElementById('materialUpload');
    const btnCancel = document.getElementById('btnCancel');
    const btnCancelTask = document.getElementById('btnCancelTask');

    const btnHangout = document.getElementById('materialAdds');
    const btnFileUpload = document.getElementById('fileupload');
    const txtSendMessage = document.getElementById('textField');
    const txtLabel = document.getElementById('textLabel');
    const txtSName= document.getElementById('txtSName');
    const txtSDuration= document.getElementById('txtSDuration');
    const txtSTName= document.getElementById('txtSTName');
    const txtSTDescription= document.getElementById('txtSTDescription');

    const txtTASKDuration= document.getElementById('txtTASKDuration');
    const txtTASKName= document.getElementById('txtTASKName');
    const txtTASKUser= document.getElementById('txtTASKUser');
    const txtTASKDescription= document.getElementById('txtTASKDescription');

    const btnSubmitSprint = document.getElementById('btnSubmitSprint');
    const btnSubmitTask = document.getElementById('btnSubmitTask');
    const btnAddSprint = document.getElementById('newSprint');
    

    $('#Messages').hide();
    $('#fileupload').hide();
    $('#AddSprint').hide();
    $('#AddTask').hide();

    var uid, userEmail, projectID, poRef, detailsRef, projectName, projectDescription, projectUsers, projectDuration;

    btnAddSprint.addEventListener('click', e =>{
        $('#AddSprint').show();
        $('#ProjectDetails').hide();
        $('#MessageClick').hide();
        $('#materialUpload').hide();
    });

    btnCancel.addEventListener('click', e =>{
        $('#AddSprint').hide();
        $('#AddStory').hide();
        $('#AddTask').hide();
        $('#ProjectDetails').show();
        $('#MessageClick').show();
        $('#materialUpload').show();
    });

    btnCancelTask.addEventListener('click', e =>{
        $('#AddSprint').hide();
        $('#AddStory').hide();
        $('#AddTask').hide();
        $('#ProjectDetails').show();
        $('#MessageClick').show();
        $('#materialUpload').show();
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

    btnMessageClick.addEventListener('click', e =>{
        $('#Messages').show();
        $('#MessageClick').hide();
        $('#materialUpload').hide();
        $('#ProjectDetails').hide();
        $('#materialAdds').hide();
    });

    btnMessageClose.addEventListener('click', e =>{
        $('#Messages').hide();
        $('#MessageClick').show();
        $('#materialUpload').show();
        $('#ProjectDetails').show();
        $('#materialAdds').show();
        poCheck();

    });

    btnMaterialUpload.addEventListener('click', e =>{

        document.getElementById('fileupload').click();
    });


    btnFileUpload.addEventListener('change', e =>{
        var a=document.getElementById('fileupload');

        var file = a.files[0];
        var nameFile= file.name;
        var storageRef = firebase.storage().ref(projectID+'/'+file.name);
        var task = storageRef.put(file);
        task.on('state_changed',

            function progress(snapshot){
                document.getElementById('spinner').className= "mdl-spinner mdl-js-spinner  is-active"
            },

            function error(err){

            },

            function complete(){
                document.getElementById('spinner').className= "mdl-spinner mdl-js-spinner"
                var storageID = firebase.database().ref().child('AllFiles').push().key;
                var storageData = {
                    projID: projectID,
                    fileName: nameFile,
                };

                var updates = {};
                updates['/AllFiles/' + storageID] = storageData;
                firebase.database().ref().update(updates);
            }
        );

    });

        // Add a realtime login listner
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
           uid= firebaseUser.uid;
           userEmail= firebaseUser.email;
           $('#navigationTitle').append(userEmail);
           poCheck();
           getProjectID();
           getTasks();
           getSprints();
           getUserStories();
           getProjectDetails();
           getMessages();
           getStorage();

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

                $('#AddStory').hide();

            }
        }catch(err)
        {
            console.log(err)
        }
    }

    function getProjectDetails(){
        detailsRef = firebase.database().ref('Projects/'+projectID);
        detailsRef.on('value', function(data) {
            projName=data.val().projectName;
            projectDescription=data.val().projDescription;
            projectUsers=data.val().projUsers;
            projectDuration=data.val().projDuration;
            detailAdder(projName, projectDescription, projectUsers, projectDuration);
        });
    }

    function detailAdder(projectName, projectDescription, projectUsers, projectDuration){
        try{
            var row="   <span>Users: "+projectUsers+"</span><br>\
                        <span>Duration: "+projectDuration+"</span><br>\
                        <span>Description: "+projectDescription+"</span><br>";
           $('#projectDescription').append(row);
           $('#projNames').text(projectName);
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

    function getMessages(){
        var projRef = firebase.database().ref('AllMessages/');
        projRef.on('child_added', function(data) {
            getMessageHelper(data.val().Email, data.val().Message, data.val().projID);
        });
    }

    function getMessageHelper(email,message, id){
        try{
            if(id.localeCompare(projectID)==0)
            {
                try{
                    ////console.log("here");
                    var row= "<li id=\"indiMessage\">\
                                <span class=\"mdl-list__item-primary-content\">\
                                    <span id=\"messageTitleText\">"+email+"</span>\
                                        <div class=\"mdl-card__actions mdl-card--border\">\
                                            <span class=\"mdl-list__item-sub-title\" id=\"messageText\">"+message+"</span>\
                                        </div>\
                                </span>\
                            </li>\
                            <div class=\"mdl-card__actions mdl-card--border\"></div>\
                            <br>";
                                            //console.log("here2");
                    $('#messagesView').append(row);
                                    //console.log("here3");
                }
                catch(error){
                    console.log(error);
                }
            }
        }catch(err)
        {
            console.log(err);
        }
    }

    function getStorage(){
        var storRef = firebase.database().ref('AllFiles/');
        storRef.on('child_added', function(data) {
            getStorageHelper(data.val().fileName, data.val().projID);
        });
    }

    function getStorageHelper(file, id){
        try{
            if(id.localeCompare(projectID)==0)
            {
                var storageRef= firebase.storage().ref();
                var linkRef = storageRef.child(projectID+'/'+file);
                linkRef.getDownloadURL().then(function(url) {
                    var row= "<tr>\
                                <th class=\"mdl-data-table__cell--non-numeric\">"+file+"</th>\
                                <th class=\"mdl-data-table__cell--non-numeric\"><a href=\""+url+"\">Link</a></th>\
                            </tr>";
                    $('#storageData').append(row);
                    // Get the download URL for 'images/stars.jpg'
                    // This can be inserted into an <img> tag
                    // This can also be downloaded directly
                    // add
                }).catch(function(error) {
                    // Handle any errors
                });
            }
        }catch(err)
        {
            console.log(err);
        }
    }

    btnMessageSend.addEventListener('click', e =>{
        const message= txtSendMessage.value;

        if(message==null)
        {
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Please Enter a Message'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
        else
        {
            var messageID = firebase.database().ref().child('AllMessages').push().key;
            var messageData = {
                projID: projectID,
                Email: userEmail,
                Message: message,
            };

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/AllMessages/' + messageID] = messageData;
            firebase.database().ref().update(updates);
            txtSendMessage.value="Enter Message...";
        }
        //console.log(message);
    });

    btnSubmitSprint.addEventListener('click', e => {

        const sprintName= txtSName.value;
        const sprintDuration= txtSDuration.value;

        if(isEmpty(sprintName) || isEmpty(sprintDuration))
        {
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Missing Fields'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
        else if (parseInt(sprintDuration)>60)
        {
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Invalid # of weeks'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
        else
        {
            // Get a key for a new Post.
            var sprintID = firebase.database().ref().child('Sprints').push().key;

            var postData = {
                sprintID: sprintID,
                projectID: projectID,
                sprintName: sprintName,
                sprintDuration: sprintDuration,
            };

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/Sprints/' + sprintID] = postData;

            firebase.database().ref().update(updates);

            $('#AddSprint').hide();
            $('#ProjectDetails').show();
            $('#MessageClick').show();
            $('#materialUpload').show();
            txtSName.value = "";
            txtSDuration.value = "";
            var snackbarContainer = document.querySelector('#demo-toast-example');
            var data = {message: 'Sprint Created :)'};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    });


    function getTasks(){
        var taskRef = firebase.database().ref('Tasks/');
        taskRef.on('child_added', function(data) {
            try{
                if(data.val().projectID.localeCompare(projectID)==0)
                {
                    addTaskHTML(data.val().taskName, data.val().taskAssigned, data.val().taskID, data.val().taskDuration, data.val().taskCompleted);
                }
            }catch(err)
            {
                console.log(err);
            }
        });
    }

    function addTaskHTML(name, assigned, id, duration, completed){
        ////console.log(name+" "+ time);
           var row= "<tr>\
                       <th class=\"mdl-data-table__cell--non-numeric\">"+name+"</th>\
                       <th class=\"mdl-data-table__cell--non-numeric\"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"taskLink\">Link</button></th>\
                       <input type=\"hidden\" name=\"taskID\" class=\"taskID\" value="+id+">\
                       <th class=\"mdl-data-table__cell--non-numeric\">"+assigned+"</th>\
                       <th class=\"mdl-data-table__cell--non-numeric\">"+duration+"</th>\
                       <th class=\"mdl-data-table__cell--non-numeric\">"+completed+"</th>\
                   </tr>";
           $('#taskData').append(row);

    }


    function getSprints(){
        var sprintRef = firebase.database().ref('Sprints/');
        sprintRef.on('child_added', function(data) {
            try{
                if(data.val().projectID.localeCompare(projectID)==0)
                {
                    addSprintHTML(data.val().sprintName, data.val().sprintID, data.val().sprintDuration);
                }
            }catch(err)
            {
                console.log(err)
            }
        });
    }


    function addSprintHTML(name, id, duration){
        ////console.log(name+" "+ time);
           var row= "<tr>\
                       <th class=\"mdl-data-table__cell--non-numeric\">"+name+"</th>\
                       <th class=\"mdl-data-table__cell--non-numeric\"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"sprintLink\">Link</button></th>\
                       <input type=\"hidden\" name=\"sprintID\" class=\"sprintID\" value="+id+">\
                       <th class=\"mdl-data-table__cell--non-numeric\">"+duration+"</th>\
                   </tr>";
           $('#sprintData').append(row);

    }

    function getUserStories(){
        var usRef = firebase.database().ref('UserStories/');
        usRef.on('child_added', function(data) {
            try{
                if(data.val().projectID.localeCompare(projectID)==0)
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
                </tr>";
        $('#storyData').append(row);
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

    $(document).on('click', '#sprintLink', function(){
        var sendSprintID= $('input[type=hidden]', $(this).closest("tr")).val();

        if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.setItem("sprintID", sendSprintID);
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
        window.open('sprint.html','_self',false);

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

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }


}());
