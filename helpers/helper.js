let self = module.exports = {

    //SORT ARRAY OBJECT DYNAMICALLY
    compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    },
    //Convert image to base64
    base64(pathFile) {
        const fs = require('fs-extra');
        let base64data = null;
        try {
            let buff = fs.readFileSync(pathFile);
            base64data = buff.toString('base64');
        } catch (error) {
            console.log('Image not converted to base 64 :\n\n' + error);
        }
        //console.log('Image converted to base 64 is:\n\n' + base64data);
        return base64data;
    },

}