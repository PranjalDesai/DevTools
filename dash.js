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

    const btnLogOut = document.getElementById('btnLogOut');
    const btnDashboard = document.getElementById('btnDashboard');
    const btnProfile = document.getElementById('btnProfile');
    const btnSprint = document.getElementById('btnSprint');
    const btnAddProject = document.getElementById('newProject');
    const btnCancel = document.getElementById('btnCancel');
    const btnSubmit = document.getElementById('btnSubmit');
    const btnProjLink = document.getElementById('projectLink');
    const txtPName= document.getElementById('txtPName');
    const txtPUsers= document.getElementById('txtPUsers');
    const txtPDescription= document.getElementById('txtPDescription');
    const txtPDuration= document.getElementById('txtPDuration');
    const txtPNumbSprints= document.getElementById('txtPNumbSprints');
    const txtProjectID= document.getElementById('projID');
    $('#AddProject').hide();
    var uid, userEmail;
    var poRef;
    var role='';

    btnAddProject.addEventListener('click', e =>{
        $('#AddProject').show();
        $('#dashView').hide();
    });

    btnCancel.addEventListener('click', e =>{
        $('#AddProject').hide();
        $('#dashView').show();
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
           //console.log(userEmail);
           $('#navigationTitle').append(userEmail);

           poCheck();
           getProjects();
           getTasks();


        }else{
            window.open('index.html','_self',false);
            //console.log('user not found');
        }

    });


    //Checks if the user is Product Owner else hide tha ability to start new project
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
    	////console.log(role);
        try{
           	if(role.localeCompare(comp)!=0){
           		$('#newProject').hide();
           	}
        }
        catch(err)
        {
            console.log(err);
        }
    }

    function getProjects(){
    	var projRef = firebase.database().ref('AllProjects/');
    	projRef.on('child_added', function(data) {
        	getProjectsHelper(data.val().Email, data.val().projID);
        });
    }

    function getProjectsHelper(email, id){
        try{
        	if(email.localeCompare(userEmail)==0)
        	{
                //console.log('here');
        		var currProjRef = firebase.database().ref('Projects/'+id);
        		currProjRef.on('value', function(data) {
            		addProjectHTML(data.val().projectName, data.val().projectID);
            	});
        	}
        }catch(err)
        {
            console.log(err);
        }
    }

    function addProjectHTML(name, id){
        try{
    	var row= "<tr>\
                    <th class=\"mdl-data-table__cell--non-numeric\">"+name+"</th>\
      				<th class=\"mdl-data-table__cell--non-numeric\"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"projectLink\">Link</button></th>\
                    <input type=\"hidden\" name=\"projID\" class=\"projID\" value="+id+">\
    			</tr>";
    	$('#projectData').append(row);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    $(document).on('click', '#projectLink', function(){
        var sendProjID= $('input[type=hidden]', $(this).closest("tr")).val();

        if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.setItem("pID", sendProjID);
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
        window.open('project.html','_self',false);

    });


    

    function getTasks(){
        var taskRef = firebase.database().ref('Tasks/');
        //console.log('here111');
        taskRef.on('child_added', function(data) {
            try{
                if(data.val().taskAssigned.localeCompare(userEmail)==0)
                {
                    //console.log('here222'+data.val().taskID);
                    var x= parseInt(data.val().taskDuration) - parseInt(data.val().taskCompleted);
                    addTaskHTML(data.val().taskName, x, data.val().taskID, data.val().taskStatus, parseInt(data.val().taskDuration));
                }
            }catch(err)
            {
                console.log(err);
            }
        });
    }
            
    function addTaskHTML(name, time, id, status, duration){
    ////console.log(name+" "+ time);
    // if greater than half turn green
    var colorMe;
   if(time > (duration * 0.66)){
      colorMe = "#42f465";
   }
   if(time < (duration * 0.33)){
      colorMe = "#f78379";
   }
  if((time < (duration * 0.66)) && (time > (duration * 0.33))){
     colorMe = "#fffb28";
  }

   try{
        if(status.localeCompare("BackLog")==0)
        {
            var row= "<tr id="+id+" draggable=\"true\" ondragstart=\"BLdrag(event)\">\
                    <th class=\"mdl-data-table__cell--non-numeric\">"+name+"</th>\
                    <th class=\"mdl-data-table__cell--non-numeric\"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"taskLink\">Link</button></th>\
                    <th class=\"mdl-data-table__cell--non-numeric\" id=\"timeID\">"+time+"</th>\
                    <input type=\"hidden\" name=\"taskID\" class=\"taskID\" value="+id+">\
                </tr>";
            $('#BLData').append(row);
        } else if (status.localeCompare("OnGoing")==0)
        {
            var row= "<tr id="+id+" draggable=\"true\" ondragstart=\"OGdrag(event)\">\
                    <th class=\"mdl-data-table__cell--non-numeric\" bgcolor= "+colorMe+">"+name+"</th>\
                    <th class=\"mdl-data-table__cell--non-numeric\" bgcolor= "+colorMe+"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"taskLink\">Link</button></th>\
                    <th class=\"mdl-data-table__cell--non-numeric\" bgcolor= "+colorMe+" id=\"timeID\">"+time+"</th>\
                    <input type=\"hidden\" name=\"taskID\" class=\"taskID\" value="+id+">\
                </tr>";
            $('#OGData').append(row);
        }
        else if(status.localeCompare("Done")==0)
        {
            var row= "<tr id="+id+">\
                    <th class=\"mdl-data-table__cell--non-numeric\">"+name+"</th>\
                    <th class=\"mdl-data-table__cell--non-numeric\"><button class=\"mdl-button mdl-js-button mdl-button--accent\" id=\"taskLink\">Link</button></th>\
                    <th class=\"mdl-data-table__cell--non-numeric\" id=\"timeID\">"+time+"</th>\
                    <input type=\"hidden\" name=\"taskID\" class=\"taskID\" value="+id+">\
                </tr>";
            $('#DData').append(row);
        }
    }catch(err)
    {
        console.log(err)
    }
}


    $(document).on('click', '#taskLink', function(){
        var sendTaskID= $('input[type=hidden]', $(this).closest("tr")).val();

        if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.setItem("tID", sendTaskID);
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
        window.open('task.html','_self',false);
        
    });


	btnSubmit.addEventListener('click', e => {

        const projName= txtPName.value;
        const projUsers= txtPUsers.value;
        const projDescription= txtPDescription.value;
        const projDuration= txtPDuration.value;
        const projNumSprints= txtPNumbSprints.value;
        try{
	        if(isEmpty(projName) || isEmpty(projUsers) || isEmpty(projDescription) || isEmpty(projDuration) || isEmpty(projNumSprints))
	        {
	            var snackbarContainer = document.querySelector('#demo-toast-example');
	            var data = {message: 'Missing Fields'};
	            snackbarContainer.MaterialSnackbar.showSnackbar(data);
	        }
	        else if (parseInt(projDuration)>24 || parseInt(projNumSprints)>20)
	        {
	            var snackbarContainer = document.querySelector('#demo-toast-example');
	            var data = {message: 'Invalid project Duration or # of Sprints'};
	            snackbarContainer.MaterialSnackbar.showSnackbar(data);
	        }
	        else
	        {
	        	var seperateUsers= projUsers.split(',');

	            // Get a key for a new Post.
	        	var projID = firebase.database().ref().child('Projects').push().key;

				for (var i = 0; i < seperateUsers.length; i++) {
					seperateUsers[i]= seperateUsers[i].replace(/\s/g, '');
	        		reportAllUsers(seperateUsers[i], projID);
	        	}

	            var postData = {
	            	projectID: projID,
	                projectName: projName,
	                projUsers: projUsers,
	                projDescription: projDescription,
	                projDuration: projDuration,
	                projNumSprints: projNumSprints,
	            };

	            // Write the new post's data simultaneously in the posts list and the user's post list.
	            var updates = {};
	            updates['/Projects/' + projID] = postData;

	            firebase.database().ref().update(updates);

	            $('#AddProject').hide();
	            $('#dashView').show();
	            txtPName.value = "";
	            txtPUsers.value ="";
	            txtPDescription.value = "";
	            txtPDuration.value = "";
	            txtPNumbSprints.value = "";
	            var snackbarContainer = document.querySelector('#demo-toast-example');
	            var data = {message: 'Project Created :)'};
	            snackbarContainer.MaterialSnackbar.showSnackbar(data);
	        }
	    }
	    catch(err)
        {
        	console.log(err);
        }

    });

    function reportAllUsers(email, id)
    {
    	var newPostKey = firebase.database().ref().child('posts').push().key;
    	var postData = {
            projID: id,
            Email: email
        };

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/AllProjects/' + newPostKey] = postData;
        firebase.database().ref().update(updates);
    }

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

}());
