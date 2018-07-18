//create new item
function addItems(){
	var clientContext = new SP.ClientContext.get_current();	
	var oList = clientContext.get_web().get_lists().getByTitle('listName');
	var itemCreateInfo = new SP.ListItemCreationInformation();

	this.oListItem = oList.addItem(itemCreateInfo);
		//single line of text
			oListItem.set_item('Title', 'New item');
		//multiline text
			oListItem.set_item('MultiLine', '<p><strong>Hello!</strong></p>');
		//single choice
			oListItem.set_item('SingleChoice', 'Enter Choice #1');
		//single people by id
			var SinglePeople = new SP.FieldLookupValue();
				PlanerField.set_lookupId(1);
			oListItem.set_item('SinglePeople', SinglePeople); //in REST API: ColumnName + Id
		//multi peoples by id
			var PeopleIds = [1,2];
			var MultiplePeople = [];
			for (var index in PeopleIds){
				var PeopleFiled = new SP.FieldLookupValue();
					PeopleFiled.set_lookupId(PeopleIds[index]);
				MultiplePeople.push(PeopleFiled);
			}
			oListItem.set_item('MultiplePeoplebyId', MultiplePeople);
		//multiple people by mail, name, loginname
			var Peoples =['user@domain.com', 'Name Surname', 'domain\\loginname'];
			var SetPeoples= [];
			for (var index in Peoples){
				var PeopleToSet = SP.FieldUserValue.fromUser(Peoples[index]);
				SetPeoples.push(PeopleToSet);
			}
			oListItem.set_item('MultiplePeople', SetPeoples);
		//choice yes=1,no=0
			oListItem.set_item('Choice', 1);  
		//hyperlink/picture
			var Link = new SP.FieldUrlValue();
				Link.set_url("http://google.com")
				Link.set_description("google");  
			 oListItem.set_item('Link', Link);
		 //currency
			oListItem.set_item('Currency', '50');
		 //date
			oListItem.set_item('Date', '1/10/2018');
	oListItem.update();

	clientContext.executeQueryAsync(
		Function.createDelegate(this, function(){
			console.log('Item created'+oListItem.get_id());
		}),
		Function.createDelegate(this, function(sender, args){
			console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		})
	);
}

//get current user
function getUserInfo(){
	var context = new SP.ClientContext.get_current();
	this.website = context.get_web();
	this.currentUser = website.get_currentUser();
	context.load(currentUser);
	context.executeQueryAsync(Function.createDelegate(this, function(){
		console.log(currentUser.get_loginName()); //print loginName: i:0#.w|domian\login
		console.log(currentUser.get_id()); //print Id: 1
		console.log(currentUser.get_title()); //print user: Name Surname
	}), Function.createDelegate(this, function(sender, args){
		console.log('request failed ' + args.get_message() + '\n'+ args.get_stackTrace());
	}));
}

//get user groups
function getUserGroup(){ 
	var clientContext = new SP.ClientContext.get_current();
	var oWeb = clientContext.get_web();
	var currentUser = oWeb.get_currentUser();
	var allGroups = currentUser.get_groups();
	clientContext.load(allGroups);
	
	clientContext.executeQueryAsync(Function.createDelegate(this, function(){
		var grpsEnumerator = allGroups.getEnumerator();
		while(grpsEnumerator.moveNext()){
			var group = grpsEnumerator.get_current();	
			console.log(group.get_title()); //print group name
			console.log(group.get_id()); //print group id
		}
	}), Function.createDelegate(this, function(sender, args){
		console.log(args.get_message());
	}));
}

//add user to group
function addUserSharePointGroup() {
	// var siteUrl = '/sites/MySiteCollection ';
	var clientContext = new SP.ClientContext.get_current();
	var oWeb = clientContext.get_web().get_siteGroups();
	var oGroup = oWeb.getById(19); //posible to oWeb.getByName('groupName');
	var userCreationInfo = new SP.UserCreationInformation();
		userCreationInfo.set_email('user@domain.com');
		userCreationInfo.set_loginName('domain\\loginname');
		userCreationInfo.set_title('Michal Kowalik');
	this.oUser = oGroup.get_users().add(userCreationInfo);
	clientContext.load(oUser);
	clientContext.executeQueryAsync(Function.createDelegate(this,function(){
		console.log(this.oUser.get_title() + " added.");
	}), Function.createDelegate(this, function(sender, args){
		console.log(('Request failed. ' + args.get_message() + '\n'+args.get_stackTrace()));
	}));
}

//add new group
 function createGroup(){
	var clientContext = new SP.ClientContext();
	var oWeb = clientContext.get_web();
	var groupCollection = oWeb.get_siteGroups();
	var newGroup = new SP.GroupCreationInformation();
		newGroup.set_title('New createGroup');
		newGroup.set_description('This group handles the access to Admin documents'); oWeb.get_siteGroups().add(newGroup);
	clientContext.load(groupCollection); clientContext.executeQueryAsync(function(){
		console.log('New group has been created.');
	}, function(){
		console.log('Request failed:' + args.get_message());
	});
}

//remove group
function DeleteWebGroup() {
	var clientContext = new SP.ClientContext.get_current();
	var collGroup = clientContext.get_web().get_siteGroups();
	var oGroup = collGroup.getById(1297); //posible to collGroup.getByName('groupName');
  		collGroup.remove(oGroup);
	clientContext.executeQueryAsync(Function.createDelegate(this, function(){
		console.log("Group deleted.");
	}), Function.createDelegate(this, function(sender, args){
		console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
	}));
}