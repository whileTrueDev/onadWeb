var CustomDate = function (){
  this.getKoreaDate = ()=>{
    const date  = new Date();
    date.setHours(date.getHours() + 9);
    dateString = date.toLocaleString('ko-KR', {
        timeZone: 'UTC',
        hour12 : false,
        year   : '2-digit',
        month  : '2-digit',
        day    : '2-digit',
        hour   : '2-digit',
        minute : '2-digit',
        second : '2-digit' });
    return dateString;
  };
  this.getCode = ()=>{
    const date = this.getKoreaDate();
    if(process.platform === "win32" || process.platform ===  "darwin"){
      const [year, month, day] = date.split(' ')[0].split('-');
      const [hour, min, second] = date.split(' ')[1].split(':');
      return `${year}${month}${day}${hour}${min}`;
    }else{
      const [month, day, year] = date.split(', ')[0].split('/');
      const [hour, min, second] = date.split(', ')[1].split(' ')[0].split(':');
      return `${year}${month}${day}${hour}${min}`;
    }
  }
}

module.exports = CustomDate;