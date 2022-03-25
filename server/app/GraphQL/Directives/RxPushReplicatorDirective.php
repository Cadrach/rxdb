<?php

namespace App\GraphQL\Directives;

use App\GraphQL\Arguments\RxUpsertModel;
use Illuminate\Database\Eloquent\Relations\Relation;
use Nuwave\Lighthouse\Execution\Arguments\SaveModel;
use Nuwave\Lighthouse\Schema\Directives\MutationExecutorDirective;

class RxPushReplicatorDirective extends MutationExecutorDirective
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Create or update an Eloquent model with the input values of the field.
"""
directive @rxPushReplicator on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION
GRAPHQL;
    }

    protected function makeExecutionFunction(?Relation $parentRelation = null): callable
    {
        return new RxUpsertModel(new SaveModel($parentRelation));
    }
}
