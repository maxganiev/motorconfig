<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionsPricelistAdchr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //прописать столбцы для всех опций:
        Schema::create('oc_adchr_options_pricelist', function (Blueprint $table) {
            $table->integer('id');
            $table->string('framesize');
            $table->string('V1_IP54');
            $table->string('V2_IP54');
            $table->string('V1_IP55');
            $table->string('V2_IP55');
            $table->string('V3');
            $table->string('V4');
            $table->string('N');
            $table->string('conicshaft');
            $table->string('W1');
            $table->string('H');
            $table->string('S1');
            $table->string('S12');
            $table->string('B1');
            $table->string('B2');
            $table->string('B3');
            $table->string('B4');
            $table->string('B5');
            $table->string('B6');
            $table->string('U2');
            $table->string('U1');
            $table->string('UHL1');
            $table->string('UHL2');
            $table->string('IP55');
            $table->string('IP54');
            $table->string('IP65');
            $table->string('IP66');
            $table->string('pkg');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('oc_adchr_options_pricelist');
    }
}
