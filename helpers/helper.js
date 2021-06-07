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
    simpleUpload(req, filename, full_path_directory, field_name) {
        try {
            if (!req.files) {
                msg = {
                    status: false,
                    message: 'No file uploaded'
                };
                console.log(msg);
                return msg;
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let avatar = req.files[field_name];
                let split_img_name = avatar.name.split(".");
                let img_extension = split_img_name[1];
                if (filename == "") {
                    filename = avatar.name;
                } else {
                    filename = filename + "." + img_extension;
                }
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                avatar.mv(full_path_directory + filename);
                msg = {
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: filename,
                        mimetype: avatar.mimetype,
                        size: avatar.size
                    }
                };
                return msg;
            }
        } catch (err) {
            //res.status(500).send(err);
            console.log(err);
        }
    },
}