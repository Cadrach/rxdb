<?php

namespace App\GraphQL\Directives;

use GraphQL\Language\AST\FieldDefinitionNode;
use GraphQL\Language\AST\ObjectTypeDefinitionNode;
use GraphQL\Language\Parser;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Collection;
use Nuwave\Lighthouse\Pagination\PaginationManipulator;
use Nuwave\Lighthouse\Pagination\SimplePaginatorField;
use Nuwave\Lighthouse\Schema\AST\ASTHelper;
use Nuwave\Lighthouse\Schema\AST\DocumentAST;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldManipulator;
use Nuwave\Lighthouse\Support\Contracts\FieldResolver;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class RxPullReplicatorDirective extends BaseDirective implements FieldResolver, FieldManipulator
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Query multiple model entries as a paginated list.
"""
directive @rxPullReplicator on FIELD_DEFINITION
GRAPHQL;
    }

    public function manipulateFieldDefinition(DocumentAST &$documentAST, FieldDefinitionNode &$fieldDefinition, ObjectTypeDefinitionNode &$parentType): void
    {
        $fieldDefinition->arguments[] = Parser::inputValueDefinition(/** @lang GraphQL */ <<<'GRAPHQL'
"Last UUID."
lastId: String!
GRAPHQL
        );
        $fieldDefinition->arguments[] = Parser::inputValueDefinition(/** @lang GraphQL */ <<<'GRAPHQL'
"Latest update."
minUpdatedAt: Int!
GRAPHQL
        );
        $fieldDefinition->arguments[] = Parser::inputValueDefinition(/** @lang GraphQL */ <<<'GRAPHQL'
"Number of items to return."
limit: Int!
GRAPHQL
        );
    }

    public function resolveField(FieldValue $fieldValue): FieldValue
    {
        return $fieldValue->setResolver(
            function ($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)use($fieldValue)  {
                $query = $this->getModelClass()::query();

                return $query->whereRaw("UNIX_TIMESTAMP(updated_at) > ?", $args['minUpdatedAt'])
                    ->orderByRaw('updated_at ASC, id ASC')
                    ->limit($args['limit'])
                    ->withTrashed() //we need this because we have to update RxDB with deleted items
                    ->get()
                ;
            }
        );
    }
}
