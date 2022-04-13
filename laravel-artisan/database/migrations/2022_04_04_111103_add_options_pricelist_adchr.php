<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOptionsPricelistAdchr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('oc_adchr_options_pricelist', function (Blueprint $table) {
            $table->string('F2')->after('pkg');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('oc_adchr_options_pricelist', function (Blueprint $table) {
            $table->dropColumn('F2');
        });
    }
}
