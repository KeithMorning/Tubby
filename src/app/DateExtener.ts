export  function get_current_day(){
    let datestr ='';
    let date = new Date();
    datestr =  date.getFullYear() + '/'+(date.getMonth()+1)+'/'+date.getDate();
    return datestr;
}

export  function get_current_year(){
    let datestr = '';
    let date = new Date();
    datestr = datestr + date.getFullYear();
    return datestr;
}