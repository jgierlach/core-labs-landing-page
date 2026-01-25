---
title: How To Fix Primary Key Error In Supabase
date: 2025-03-18
description: After a manual upload to your database in Supabase you need to run a specific query or you will encounter errors.
headerImage: /blog/supabase-query.png
---

## The Problem
If you're seeding a table in Supabase from a CSV file, you might encounter an error when your application attempts to insert a new row into the table through the API.

This error occurs because Supabase tracks the primary key for every row inserted into a table to ensure each row has a unique identifier. However, during the CSV seeding process, Supabase can lose track of the primary key count. When you try to insert a new row after seeding, Supabase fails to generate a unique identifier, resulting in an error.

## The Solution
Fortunately, there’s a simple SQL command to resolve this issue. The following command resets the primary key sequence to align with the highest value currently in your table. This example assumes your table's primary key is named id. If your primary key has a different name, replace id with the correct column name.

```
SELECT setval(pg_get_serial_sequence('your_table_name', 'id'), MAX(id)) FROM your_table_name;
```

![Screenshot of Supabase](/blog/supabase-query.png)

## How It Works
This command updates the sequence associated with your table's primary key. It ensures Supabase knows the last used value for the primary key and can generate new unique identifiers without conflicts. Once the sequence is reset, your application will be able to insert new rows seamlessly.