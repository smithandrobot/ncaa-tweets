Utils = (function Utils() 
{
	this.addCommas = addCommas;
	
	function addCommas(nStr)
	{
		nStr = String(nStr);
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(nStr)) {
			nStr = nStr.replace(rgx, '$1' + ',' + '$2');
		}
		return nStr;
	}
	
	return this;
	
})();
