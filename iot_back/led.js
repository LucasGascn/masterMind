exports.LedLighter = (ledArray,correctLength, misplacedLength) =>{
    const n = correctLength // number of correct numbers
    const m = misplacedLength // number of misplaced numbers
    for(let i = 0; i < 5; i++){
        if( n > i){
            // turn the green LED on
            ledArray[i][0] = null // TODO replace null with remote AT command to set to 04
        }else if (m > i - n ){
            // turn the blue LED on
            ledArray[i][1] = null // TODO replace null with remote AT command to set to 04
        }else{
            // turn both LEDs off
            ledArray[i][0] = null // TODO replace null with remote AT command to set to 00
            ledArray[i][1] = null // TODO replace null with remote AT command to set to 00
        }
    }
}