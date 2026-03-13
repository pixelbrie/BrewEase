const menuService = require("../services/menuService");

exports.getAllMenu = async (req, res) => {
    try{
         const items = await menuService.getAllMenu();
        res.json(items);
    }catch(err){
        console.error(err)
        return res.status(500).json({error: "Server error"})
    }
    
}
exports.getMenuById = async (req, res) => {
    try{
        const item = await menuService.getMenuById(req.params.id);

        if(!item){
            return res.status(404).json({error: "Menu item Not Found"});
        }
        res.json(item);

    }catch(err){
        console.error(err)
        return res.status(500).json({error: "Server error"})
    }
}

exports.createMenuItem = async (req, res) => {
    try{
        const newItem = await menuService.createMenuItem(req.body);
        res.status(201).json(newItem)
    }catch(err){
        console.error(err)
        return res.status(500).json({error: "Server error"})
    }
}
exports.updateMenuItem = async (req, res) => {
    try{
        const updated = await menuService.updateMenuItem(req.params.id, req.body);

        if (!updated){
            return res.status(404).json({error: "Menu Item Not Found"})
        }

        res.json(updated)
        
    }catch(err){
        console.error(err)
        return res.status(500).json({error: "Server error"})
    }
};

exports.deleteMenuItem = async (req, res) => {
    try{
        const deleted = await menuService.deleteMenuItem(req.params.id);

        if(!deleted){
            return res.status(404).json({error: "Menu Item Not Found"})
        }
        res.json(deleted)
    }catch(err){
        console.error(err)
        return res.status(500).json({error: "Server error"})
    }
}
