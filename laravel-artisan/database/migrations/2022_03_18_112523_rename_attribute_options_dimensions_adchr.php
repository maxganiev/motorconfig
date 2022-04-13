<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameAttributeOptionsDimensionsAdchr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('oc_adchr_options_dimensions', function (Blueprint $table) {
            $table->renameColumn('h_if_naezd', 'h31_if_naezd');
        });
    }


    public function down()
    {
        Schema::table('oc_adchr_options_dimensions', function (Blueprint $table) {
            $table->renameColumn('h_if_naezd', 'h31_if_naezd');
        });
    }
}
