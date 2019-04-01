exports.seed = function(knex, Promise) {
  return knex("users").insert([
    { username: "Jon Snow", password: "password" },
    { username: "Sansa Stark", password: "password" },
    { username: "Tyrion Lannister", password: "password" }
  ]);
};
