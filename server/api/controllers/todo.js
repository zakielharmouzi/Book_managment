import pool from '../../db.js';
import {request, response} from 'express';

export const getUsers = async (request, response) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        response.json(allUsers.rows);
        console.log(allUsers.rows);
    } catch (error) {
        console.error(error.message);
    }
};

export const getUserById = async (request, response) => {
    try {
        const { id } = request.params;
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        response.json(user);
    } catch (error) {
        console.error(error.message);
    }
};
