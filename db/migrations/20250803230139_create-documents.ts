import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.createTable('transactions', (table)=>{
        table.uuid('id').primary()  //chave primaria q indica um id generico
        table.text('title').notNullable() //campo texto , q nao pode ser vazio
        table.decimal('amount',10,2).notNullable()
        table.text('type').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions') //desfaz a tabela
}

