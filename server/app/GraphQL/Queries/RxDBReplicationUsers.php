<?php

namespace App\GraphQL\Queries;

use App\Models\User;

class RxDBReplicationUsers
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        return User::whereRaw("UNIX_TIMESTAMP(updated_at) > ?", $args['minUpdatedAt'])
            ->orderByRaw('updated_at ASC, id ASC')
            ->limit($args['limit'])
            ->withTrashed() //we need this because we have to update RxDB with deleted items
            ->get()
        ;
    }
}
