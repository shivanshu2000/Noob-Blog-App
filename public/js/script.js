 let btnShow= document.getElementById('add_comment_btn')
 let input= document.getElementsByClassName('comment__input')

 input.addEventListener('keyup',()=>{
     if(input.nodeValue.length>0){
         btnShow.disabled=false;
     }else{
         btnShow.disabled=true
     }
 })