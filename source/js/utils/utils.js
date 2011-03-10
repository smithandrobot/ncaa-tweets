Utils = (function Utils() 
{
	this.addCommas = addCommas;
	this.ordinal = ordinal;
	
	function addCommas(nStr)
	{
		nStr = String(nStr);
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(nStr)) {
			nStr = nStr.replace(rgx, '$1' + ',' + '$2');
		}
		return nStr;
	}
	
	function ordinal(n){
	    var sfx = ["th","st","nd","rd"];
        var val = n%100;
        return n + (sfx[(val-20)%10] || sfx[val] || sfx[0]);
	}
	
	return this;
	
})();
