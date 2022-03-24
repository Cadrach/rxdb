https://laravel.com/docs/9.x/sanctum
https://lighthouse-php.com/5/getting-started/installation.html

http://localhost/rxdb/server/public/graphql-playground


IDE Support:
GraphQL plugin: https://plugins.jetbrains.com/plugin/8097-js-graphql
php artisan lighthouse:ide-helper (and then remove the "repeatable" word from the generated files)


On Windows, add at the end of httpd.conf:
<IfModule mpm_winnt_module>
   ThreadStackSize 8888888
</IfModule>
ref: https://www.codexpedia.com/apache-server/parent-child-process-exited-with-status-3221225725-restarting-on-xamp-apache/#:~:text=XAMP%20apache%20%7C%20Codexpedia-,Parent%3A%20child%20process%20exited%20with%20status%203221225725%20%E2%80%94%20Restarting%20on%20XAMP,allocates%20a%20lot%20of%20stacks.&text=AND%20restart%20apache.


Creating 10 items in DB:
php artisan tinker
App\Models\User::factory(10)->create();
