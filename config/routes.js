var scrape = require("../scripts/scrape");
var Article = require("../models/Article");
var Note = require("../models/Note");
var articlesController = require("../controllers/articles");
var notesController = require("../controllers/notes");

module.exports = function(router){
    router.get("/", function(req, res){
        Article.find({saved: false}, function(error, found){
            
            console.log(found.length);
            
            if (error) {
                console.log(error);
            } else if (found.length === 0) {
                res.render("empty")
            } else {
                var hbsObjects = {
                    articles: found
                }; 
                res.render("index", hbsObjects);
            }
        });
    });
router.get("/api/fetch" , function(req, res){
    articlesController.fetch(function(err, docs){
        if (!docs || docs.insertedCount === 0) {
            res.json({message: "No new articles today. Check back tomorrow!"});
        }
        else {
            res.json({message: "Added " + docs.insertCount + " new articles!"}); 
        }
    });
});

router.get("/saved", function(req, res) {
    articlesController.get({saved: true}, function(data){
        var hbsObjects = {
            articles: data
        };
        res.render("saved" , hbsObjects);
    }); 
});

router.patch("/api/articles", function(req, res){
    articlesController.update(req.body, function(err, data){
        res.json(data);
    });
});

router.get('/notes/:id', function (req, res){
     Article.findOne({_id: req.params.id})
     .populate("note")
     .exec(function (error, doc){
         if (error) console.log(error);
         else{
             res.json(doc);
         }
     });
});

router.post('/notes/:id', function (req, res){
    var newNote = new Note(req.body);
    newNote.save(function(req, body){
        if (err)console.log(err);
        Article.findOneAndUpdate(
            {_id:req.params.id},
            {$push: {note: doc._id}},
            {new: true},
            function(err, newdoc){
                if (err)console.log(err);
                res.send(newdoc);
            });
        
    });
});

router.get('/deleteNote/:id', function(req, res){
    Note.remove({"_id": req.params.id}, function(err, newdoc){
        if(err)console.log(err);
        res.redirect('/saved');
    });
});

};