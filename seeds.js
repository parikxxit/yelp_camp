var mongoose   = require("mongoose"),
    Campground = require("./models/campgrounds.js"),
    Comment    = require("./models/comment"),
    data       = [
                    {
                        name: "New Delhi",
                        image: "http://cdn.tourism-of-india.com/pictures/travel_guide/new-delhi-796.jpeg",
                        description: "ed luctus iaculis lectus. Aenean sed ligula odio. Nunc suscipit nunc tellus, id finibus sem viverra eget. Praesent aliquam, sapien sit amet pellentesque porta, leo velit tincidunt odio, vel tempor ipsum arcu sed nisi. Curabitur augue ante, posuere ac hendrerit vestibulum, varius eu massa. Aenean accumsan porta ipsum. Vestibulum hendrerit justo nec erat gravida sagittis. Aliquam mollis nisi eget risus aliquam, ac dignissim tellus efficitur. Donec a diam eu turpis mollis vulputate sit amet sit amet elit. Vestibulum ut justo quis urna interdum tempus. Aenean lobortis nunc vitae aliquet ultricies"
                    },
                    {
                        name: "Shimla",
                        image: "https://d1j3wd17d78ehn.cloudfront.net/system/images/000/054/736/369b6e7944c0a263f03727e597cf7203/original/himachal_pardesh_65.png?1485239780",
                        description: "ed luctus iaculis lectus. Aenean sed ligula odio. Nunc suscipit nunc tellus, id finibus sem viverra eget. Praesent aliquam, sapien sit amet pellentesque porta, leo velit tincidunt odio, vel tempor ipsum arcu sed nisi. Curabitur augue ante, posuere ac hendrerit vestibulum, varius eu massa. Aenean accumsan porta ipsum. Vestibulum hendrerit justo nec erat gravida sagittis. Aliquam mollis nisi eget risus aliquam, ac dignissim tellus efficitur. Donec a diam eu turpis mollis vulputate sit amet sit amet elit. Vestibulum ut justo quis urna interdum tempus. Aenean lobortis nunc vitae aliquet ultricies"
                    },
                    {
                        name: "Manali",
                        image: "https://i.ytimg.com/vi/g8Yx-QsY1RE/maxresdefault.jpg",
                        description: "ed luctus iaculis lectus. Aenean sed ligula odio. Nunc suscipit nunc tellus, id finibus sem viverra eget. Praesent aliquam, sapien sit amet pellentesque porta, leo velit tincidunt odio, vel tempor ipsum arcu sed nisi. Curabitur augue ante, posuere ac hendrerit vestibulum, varius eu massa. Aenean accumsan porta ipsum. Vestibulum hendrerit justo nec erat gravida sagittis. Aliquam mollis nisi eget risus aliquam, ac dignissim tellus efficitur. Donec a diam eu turpis mollis vulputate sit amet sit amet elit. Vestibulum ut justo quis urna interdum tempus. Aenean lobortis nunc vitae aliquet ultricies "
                    }
        ];

function seedDB(){
    //REMOVE ALL CAMPGROUNDS
    Campground.remove({}, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("database files removed");
            //ADD FEW CAMPGROUNDS
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added campground");
                        //ADD FEW COMMENTS
                        // CREATE COMMENTS
                        Comment.create({
                            text: "Tese are the most beautiful places that I have ever seen",
                            author: "Parikshit"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                 campground.comments.push(comment);
                                 campground.save();
                                 console.log("comment added");
                            }
                        });   
                    }
                });
            });
            
        }
    });
    
}

module.exports = seedDB;