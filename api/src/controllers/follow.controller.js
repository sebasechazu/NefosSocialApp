'use strict'
import Follow from '../models/follow.model.js';

export function saveFollow(req, res) {
    
    var params = req.body;
    var follow = new Follow();
    
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
       
        if (err)
            return res.status(500).send({ mesagge: 'error al guardar el seguimiento' });
         
        if (!followStored)
            return res.status(404).send({ mesagge: 'no se a encontrado seguimiento para guardar' });
        
        return res.status(200).send({ follow: followStored });
    });
}

export function deleteFollow(req, res) {
    
    var userId = req.user.sub;
    
    var followId = req.params.id;
    
    findOneAndDelete({
        'user': userId,
        'followed': followId
    }, (err, seguimientoEliminado) => {
        
        if (err) {
            return res.status(500).send({
                mesagge: 'error al eliminar el seguimiento'
            });
        }
        
        return res.status(200).send({ message: 'el seguimiento se ha eliminado correctamente' });
    });
}

export function getFollowingUsers(req, res) {
    
    var userId = req.user.sub;
    
    if (req.params.id) {
        userId = req.params.id;
    }
    
    var page = 1;
    
    if (req.params.page) {
        page = req.params.page;
    }
    
    var itemsPerPage = 4;
    
    _find({ user: userId }).populate({ path: 'followed' })
        .paginate(page, itemsPerPage, (err, follows, total) => {
            
            if (err)
                return res.status(500).send({ mesagge: 'la solicitud no pude ser procesada' });
            
            if (!follows)
                return res.status(404).send({ mesagge: 'no esta siguiendo a ningun usuario' });
            
            
            followUserIds(req.user.sub).then((value) => {
                return res.status(200).send({
                    
                    total: total,                  
                    pages: Math.ceil(total / itemsPerPage),              
                    follows,
                    users_following: value.following,
                    users_follow_me: value.followed

                });
            });
        });
}

export function getFollowedUser(req, res) {

    var userId = req.user.suneb;
    
    if (req.params.id) {
        userId = req.params.id;
    }
    
    var page = 1;
    
    if (req.params.page) {
        page = req.params.page;
    }
    
    var itemsPerPage = 4;
    
    _find({ followed: userId }).populate('user')
        .paginate(page, itemsPerPage, (err, follows, total) => {
            
            if (err)
                return res.status(500).send({ mesagge: 'error en el servidor' });
            
            if (!follows)
                return res.status(404).send({ mesagge: 'no te sigue ningun usuario' });
            
            followUserIds(req.user.sub).then((value) => {
                
                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    follows,
                    users_following: value.following,
                    users_follow_me: value.followed,
                });
            });
        });
}

export function getMyFollows(req, res) {
    
    var userId = req.user.sub;  
    var find = _find({ user: userId });
    
    if (req.params.followed) {
        find = _find({ followed: userId });
    }
    
    find.populate('user followed').exec((err, follows) => {
        
        if (err) return res.status(500)
            .send({ mesagge: 'error en el servidor' });
        
        if (!follows)
            return res.status(404).send({ mesagge: 'no esta siguiendo a ningun usuario' });
        
        return res.status(200).send({ follows });
    });
}

export async function followUserIds(user_id) {
    
    try {
        
        var following = await _find({ "user": user_id })
            .select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
            .then((follows) => { return follows; })
            .catch((err) => { return handleError(err) });
        
        var followed = await _find({ "followed": user_id })
            .select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
            .then((follows) => { return follows; })
            .catch((err) => { return handleError(err) });

        
        var following_clean = [];
        following.forEach((follow) => {
            following_clean.push(follow.followed);
        });
        
        var followed_clean = [];
        followed.forEach((follow) => {
            followed_clean.push(follow.user);
        });
        
        return {
            following: following_clean,
            followed: followed_clean
        }
    } catch (e) {
        console.log(e);
    }
}

export default {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUser,
    getMyFollows
}
