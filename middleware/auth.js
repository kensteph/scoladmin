module.exports = (req, res, next) => {
    if (!global.appName) {
        res.redirect('/');
        return;
    } else {
        // //We expected 'x-auth-token' from the client
        // const token = req.header("x-auth-token");
        // console.log("TOKEN FROM CLIENT :", token);
        // if (!token)
        //     return res.status(401).send({ error: "Access denied. No token provided." });

        // try {
        //     const payload = jwt.verify(token, "privateKey");
        //     req.user = payload;
        //     next();
        // } catch (err) {
        //     res.status(400).send({ error: "Invalid token." });
        // }
        let requestMethod= req.method;
        let address = req.originalUrl.split("?"); //ROUTE
        let routeTakenByUser = address[0];
        console.log("VERIFY ACCESS TO THIS ROUTE : ", routeTakenByUser);
        console.log("METHOD : ",requestMethod );
        
        
        if (req.session.UserData) {
            let userData = req.session.UserData;
            console.log(userData);
            if(requestMethod=="GET"){
                    if(userData.routesAccess.includes(routeTakenByUser) || userData.routesAccess.includes("All")){
                    next();
                    console.log("User still authenticated...");
                    }else{
                        console.log("YOU DON'T HAVE ACCES TO THIS ROUTE..."+routeTakenByUser);
                        //REDIRECT THE USER
                        res.redirect('/dash-board');
                    }
            }else{
                next();
            }
            
        } else {
            console.log("REDIRECT TO LOGIN PAGE");
            res.redirect('/');
        }

    }
};