/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.createTable('password_resets', table => {
        table.string('email').notNullable();
        table.string('token').notNullable();
        table.timestamp('created_at');
        table.timestamp('expired_at');
    });
    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTable('password_resets');
}
