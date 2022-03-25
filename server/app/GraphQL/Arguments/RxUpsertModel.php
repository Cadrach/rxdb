<?php

namespace App\GraphQL\Arguments;

use Carbon\Carbon;
use Nuwave\Lighthouse\Execution\Arguments\UpsertModel;
use Nuwave\Lighthouse\Support\Contracts\ArgResolver;

/**
 * We extend the original UpsertModel to allow using our own uuid for identification of upserting
 * Class RxUpsertModel
 * @package App\GraphQL\Arguments
 */
class RxUpsertModel extends UpsertModel implements ArgResolver
{
    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param \Nuwave\Lighthouse\Execution\Arguments\ArgumentSet $args
     */
    public function __invoke($model, $args)
    {
        // TODO consider Laravel native ->upsert(), available from 8.10
        $id = $args->arguments['uuid']
            ?? $args->arguments[$model->getKeyName()]
            ?? null;

        if (null !== $id) {
            $existingModel = $model
                ->newQuery()
                ->withTrashed()
                ->firstWhere('uuid', $id->value);

            if (null !== $existingModel) {
                $model = $existingModel;
            }
        }

        return($this->previous)($model, $args);
    }
}
