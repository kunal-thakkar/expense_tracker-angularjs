app.factory('TransactionService', ['$http', '$q', function ($http, $q) {
    return {
        saveTransaction: function(o){
            var obj = Object.assign({}, o);
            obj.dateTime = o.dateTime.getTime();
            var deferred = $q.defer();
            $http.post("/transaction", obj).then(
                function(response){
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error: ', errResponse);
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        },
        deleteTransaction: function(transaction){
            var deferred = $q.defer();
            $http.delete("/transaction/"+transaction.transactionId).then(
                function(response){
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error: ', errResponse);
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        },
        filterTransaction: function(filter){
            var deferred = $q.defer();
            $http.post("/filterTransactions", filter).then(
                function(response){
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error: ', errResponse);
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        },
        getTransactions: function(query){
            var deferred = $q.defer();
            $http.post("/getTransactions", query).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function(errResponse){
                    console.error('Error: ', errResponse);
                    deferred.reject(errResponse);
                }
            );
            return deferred.promise;
        }
    };
}]);
app.controller('TransactionCtrl', ['$scope', 'TransactionService', 'UserService', 'AppUtil', function($scope, TransactionService, UserService, AppUtil){
//    UserService.validateSession();
    var self = this;
    self.paymentModes = ['HDFC Cr. Card', 'CITI Cr. Card', 'Cash'];
    self.categories = ['Food','Medical','Travelling','Other'];
    self.transaction = {};
    self.filter = {
        from: AppUtil.addDays(new Date(), -60),
        to: new Date()
    };
    self.dataTable = false;
    self.selectedRow = false;
    self.form = { visible: false };
    self.filterForm = { visible: false };
    self.addClick = function(){
        self.dataTable.$('tr.selected').removeClass('selected');
        self.selectedRow = false;
        self.transaction = {};
        self.form.visible = true;
    };
    self.editClick = function(){
        console.log(self.selectedRow.data());
        var d = Object.assign({}, self.selectedRow.data());
        d.dateTime = new Date(d.dateTime);
        self.transaction = d;
        self.form.visible = true;
    };
    self.deleteTransaction = function(){
        var p = confirm("Are you sure you want to delete?");
        if(p){
            console.log(self.selectedRow)
            TransactionService.deleteTransaction(self.selectedRow.data()).then(
                function(d){
                    self.selectedRow.remove().draw(false);
                    self.selectedRow = false;
                },
                function(e){
                    console.log(e);
                }
            );
        }
    };
    self.saveTransaction = function(){
        TransactionService.saveTransaction(self.transaction).then(
            function(d){
                self.form.visible = false;
                var d = Object.assign({}, self.transaction);
                d.dateTime = d.dateTime.getTime();
                if(self.selectedRow){
                    self.selectedRow.data(d).draw('page');
                }
                else {
                    self.dataTable.row.add(d).draw('page');
                }
                self.transaction = {};
            },
            function(e){
                alert("Error! "+ e);
            }
        );
    };
    self.applyFilter = function(){
        var filter = Object.assign({}, self.filter);
        filter.from = self.filter.from.getTime();
        filter.to = self.filter.to.getTime();
        TransactionService.filterTransaction(filter).then(
            function(d){
                self.options.data = d;
                var x = window.matchMedia("(min-width: 1023px)")
                if(!x.matches){
                    $('#filter_panel').css('display', 'none');
                }
            },
            function(e){
                alert("Error! "+e);
            }
        );
    };
    self.cancelTransaction = function(){
        self.transaction = {};
        self.form.visible = false;
    };
    self.options = {
        /*ajax: {
            url:"/getTransactions",
            dataSrc: "",
            type: "post",
            beforeSend: function (request) {
                if(UserService.getToken())
                    request.setRequestHeader("Authorization", UserService.getToken());
            }
        },*/
        responsive: true,
        columns: [
            { data: "dateTime", title:"Date", defaultContent: "", render: function(data, type, row){
                return AppUtil.formatDate(new Date(data));
            }},
            { data: "description", title: "Description", defaultContent: "" },
            { data: "category", title: "Category", defaultContent: "" },
            { data: "paymentMode", title: "Payment Mode", defaultContent: "" },
            { data: "amount", title: "Amount", defaultContent: "", render: function(data, type, row){
                return AppUtil.formatCurrency(data) + " " + row.transactionType;
            }, className: 'dt-body-right nowrap' }
        ],
        data: []
    };
    self.applyFilter();
}])