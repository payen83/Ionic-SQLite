angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $cordovaSQLite) {
    
    //$scope.employees = [];
    
    /*$http.get('http://appsmalaya.com/webservices/output.php')
        .success(function(data){
            $scope.employees = data.person;
            console.log($scope.employees);
    })*/
    $scope.btnpress = function(){

      var query2 = "SELECT name, icNo, company FROM staff";
    
    var employee = {};
    
    $cordovaSQLite.execute(db, query2)
    .then(function(res){
        if (res.rows.length > 0){
            for (var i=0; i< res.rows.length; i++){
                employee = {
                    name: res.rows.item(i).name,
                    icNo: res.rows.item(i).icNo,
                    company: res.rows.item(i).company
                };
                $scope.employees.push(employee); 
            }
            $scope.apply();
        }
    }, function(err){
       console.log(err); 
    });

    }
    
    
    
    $scope.doRefresh = function(){
        $http.get('http://appsmalaya.com/webservices/output.php')
        .success(function(data){
            $scope.employees = data.person;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }
    
    
})

.controller('AddCtrl', function($scope, $cordovaSQLite) {
    $scope.name = "";
    $scope.icNo = "";
    $scope.company = "";
    
    $scope.addNew = function(){

        var http = new XMLHttpRequest();
        var url = "http://www.appsmalaya.com/webservices/createprofile.php";
        var params = "name=" + $scope.name +
                     "&icNo=" + $scope.icNo +
                     "&company=" + $scope.company;
        
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        http.onreadystatechange = function(){
            
           if(http.readyState == 4 && http.status == 200){
               
               var response = JSON.parse(http.responseText);
               alert(response.message);
           }  // end of if
        } // end of onreadystatechange
        
        http.send(params); 
    }
    
    $scope.addToSQLite = function(){
        //console.log("add function");
        var query = "INSERT INTO staff (name, icNo, company) VALUES (?,?,?)";
        $cordovaSQLite.execute(db, query, [$scope.name, $scope.icNo, $scope.company])
        .then(function(res){
            console.log("Insert id: ", res.insertId);
        }, function(error){
            console.log("Error: ", error);
        });

        $scope.employees.push({name: $scope.name, icNo: $scope.icNo, company: $scope.company});
    }
    
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
