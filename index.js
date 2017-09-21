var fs = require("fs");
var iterate = require('nodejs-iterator');

function findHistory(computer,user,cb){
    var greatest = {   
        mtime:"",
        path:""};
    var profiles = [];
    var path = "\\\\"+computer+"\\c$\\users\\"+user+"\\AppData\\Local\\Google\\Chrome\\User Data\\"
    fs.readdir(path,function(err,files){
        if(err) cb(err);
        else {
            var re = /Default|Profile [0-9]{1,2}/
            for(var i = 0 ; i<files.length; i++){
                if(files[i].match(re)){
                    profiles.push(path+files[i]);
                }
            }
            iterate(profiles,function(profile,done){
                fs.stat(profile,function(err,stats){
                    if(stats.mtime > greatest.mtime){
                        greatest.mtime = stats.mtime;
                        greatest.path = profile;
                    }
                    done();
                });
            },function(){
                cb(null,greatest);
            }
            );
        }
    });
}

module.exports = findHistory;