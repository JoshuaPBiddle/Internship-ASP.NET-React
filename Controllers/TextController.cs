using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MyMVCApplication.Models;

namespace MyMVCApplication.Controllers
{
    public class TextController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult fetchList()
        {          
            TextDBEntities db = new TextDBEntities();
            
            var list = db.TextTables.Select(x => new TextModel
            {
                ID = x.ID,
                Name = x.Name
                
            }).ToList();
       
             return Json(new
             {
                 list = list
             });
        }

        [HttpPost]
        public ActionResult fetchItem(int id)
        {
            TextDBEntities db = new TextDBEntities();
                    
            var item = db.TextTables.Select(x => new TextModel
            {
                ID = x.ID,
                Name = x.Name,
                Content = x.Content

            }).First(m => m.ID == id);

            return Json(item);
        }


        [HttpPost]
        public ActionResult deleteItem (int id)
        {
            TextDBEntities db = new TextDBEntities();

            TextTable textTable = db.TextTables.Find(id);

            db.TextTables.Remove(textTable);

            db.SaveChanges();

            return Json(new { });
        }

        [HttpPost]
        public ActionResult handleContentSubmit(TextModel textModel)
        {
            TextDBEntities db = new TextDBEntities();

            TextTable textTable = db.TextTables.Find(textModel.ID); 

            textTable.Content = textModel.Content;

            db.SaveChanges();

            return Json(textModel);
        }

        [HttpPost]
        public ActionResult fetchContent(int id)
        {
            TextDBEntities db = new TextDBEntities();

            var content = db.TextTables.Select(x => new TextModel
            {
                Content = x.Content

            }).First(m => m.ID == id);

            return Json(content);

        }
        [HttpPost]
        public ActionResult AddTextRow(TextModel textModel)
        {
            try
            {
                TextDBEntities db = new TextDBEntities();

                TextTable textTable = new TextTable();

                textTable.Name = textModel.Name;

                db.TextTables.Add(textTable); 

                db.SaveChanges();
            }
            catch (Exception exception)
            {
                throw exception;
            }

            return Json(textModel);
        }
    }
}