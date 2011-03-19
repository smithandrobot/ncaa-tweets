function Log(s)
{
	try
	{
		if(debug) console.log(s);
	}catch(e)
	{
		// console is undefined
	}
}