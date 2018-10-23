export default helpers = {
  dateChatFormat = ( dateString ) => {
    let date = new Date(dateString);
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var hh = date.getHours();
    var mins = date.getMinutes();
    var ss = date.getSeconds();

    var yyyy = date.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    var today = dd+'/'+mm+'/'+yyyy + ' ' + hh + ':' + mins + ':' + ss;
    return today;
  }
}