

interface HelpArticleCardProps{
    id:any,
    title:string,
    subtitle:string,
    imageFile:any,
    altText:string,
    imageURL:string,
    paragraph:string,
    onDelete:any,
    onEdit:any,
    visibleState:any,
    setVisible:any,
    isUpdate:any,
    setIsUpdate:any
}

 function HelpArticleCard(HelpArticle:HelpArticleCardProps){
    const handleDelete = () => {
        HelpArticle.onDelete(HelpArticle.id);
      };
      const handleEdit = () => {
       // HelpArticle.setHelpArticlesData()
        HelpArticle.setVisible(true)
        HelpArticle.onEdit(HelpArticle.id);
        HelpArticle.setIsUpdate(true)
      };
      
   
    return ( 
    <div  className="faq-card">
        <div>
        <h4 className="question">{HelpArticle.title}</h4>
        </div>
        <p className="description">{HelpArticle.subtitle}</p>
        {HelpArticle.imageFile && <img src={`data:image/jpeg;base64,${HelpArticle.imageFile.data}`} alt="Binary Image" width="80" height="80" className="description"/>}
        <p className="description">{HelpArticle.altText}</p>
        <p className="description">{HelpArticle.imageURL}</p>
        <p className="description">{HelpArticle.paragraph}</p>
        <button onClick={handleEdit} className="buttonCard">Edit</button>
        <button onClick={handleDelete} className="buttonCard">Delete</button>
      </div>);
}

export default HelpArticleCard