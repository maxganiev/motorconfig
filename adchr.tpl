<?php echo $header; ?>
		<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
			<symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
				<path
					d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
				/>
			</symbol>
			<symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
				<path
					d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
				/>
			</symbol>
			<symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
				<path
					d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
				/>
			</symbol>
		</svg>
	<!--main-->
		<main>
			<!--area filter-->
			<section class="area-filter" id="area-filter">
					<div class="container-reverse-selection">
					<input type="text" id="input-reverse-selection" class="form-control" autocomplete=off />
					<button class="btn btn-reverse-selection" id="btn-reverse-selection">Расшифровать</button>
				</div>
				<ul class="list">
					<li>
						<button class="btn btn-5ai-select btn-option-selected" id="btn-5ai-select">5АИ</button>
						<button class="btn btn-din-select btn-option-non-selected" id="btn-din-select">DIN</button>
					</li>
					<li>
						<label for="input-model"> Наименование </label>
						<input type="text" placeholder="Начните ввод..." id="input-model" class="form-control" />
						<img src="/image/catalog/adchr/times-solid-red.svg" alt="clear input" id="icn-clear-input" />
					</li>

					<li>
						<label for="selector-rpm"> Выбрать число оборотов (об/мин) </label>
						<select id="selector-rpm" class="form-control form-control-sm">
							<option value="-">-</option>
							<option value="600">600</option>
							<option value="750">750</option>
							<option value="1000">1000</option>
							<option value="1500">1500</option>
							<option value="3000">3000</option>
						</select>
					</li>

					<li>
						<label for="selector-power"> Выбрать мощность (кВт) </label>
						<select id="selector-power" class="form-control form-control-sm">
							<option value="-">-</option>
							<option value="0.12">0.12</option>
							<option value="0.18">0.18</option>
							<option value="0.25">0.25</option>
							<option value="0.37">0.37</option>
							<option value="0.55">0.55</option>
							<option value="0.75">0.75</option>
							<option value="1.1">1.1</option>
							<option value="1.5">1.5</option>
							<option value="2.2">2.2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5.5">5.5</option>
							<option value="7.5">7.5</option>
							<option value="7.6">7.6</option>
							<option value="11">11</option>
							<option value="15">15</option>
							<option value="18.5">18.5</option>
							<option value="22">22</option>
							<option value="30">30</option>
							<option value="37">37</option>
							<option value="45">45</option>
							<option value="55">55</option>
							<option value="75">75</option>
							<option value="90">90</option>
							<option value="110">110</option>
							<option value="132">132</option>
							<option value="160">160</option>
							<option value="200">200</option>
							<option value="250">250</option>
							<option value="315">315</option>
							<option value="355">355</option>
							<option value="400">400</option>
							<option value="450">450</option>
							<option value="500">500</option>
						</select>
					</li>

				<li>
					<label for="selector-model"> Модель электродвигателя </label>
						<select id="selector-model" class="form-control form-control-sm">
							<option value="-">-</option>
						</select>
					</li>

					<li>
						<label for="selector-paws"> Тип исполнения </label>
						<select id="selector-paws" class="form-control form-control-sm"></select>
					</li>
				</ul>
			</section>

			<!--area selection-->
			<section class="area-selection" id="area-selection">
				<ul class="list">
					<li>
						<label for="selector-breaks"> Тип тормозов </label>
						<select id="selector-breaks" class="form-control form-control-sm"></select>
					</li>

					<li>
						<label for="selector-ventSystem"> Тип вентиляции </label>
						<select id="selector-ventSystem" class="form-control form-control-sm"></select>
					</li>

					<li class="form-check form-switch">
						<label for="checkbox-encoder"> Энкодер </label>
						<input type="checkbox" id="checkbox-encoder" data-itemId="N" class="form-check-input" role="switch" />
					</li>

					<li class="form-check form-switch">
						<label for="checkbox-conicShaft"> Конический вал </label>
						<input type="checkbox" id="checkbox-conicShaft" data-itemId="conicshaft" class="form-check-input" role="switch" />
					</li>
				</ul>
			</section>

			<!--area render-->
			<section class="area-render" id="area-render">
				<h2 id="model-name"></h2>
				<img id="img-drawing" alt="Здесь должен быть чертеж двигателя..."/>
					
				<h3>Присоединительные размеры</h3>
				<div class="chart-connectionParams" id="chart-connectionParams"> </div>

				<ul class="list chart-description">
					<li class="listItem-upgrades" id="listItem-upgrades"></li>
				</ul>

				<ul class="list-pricedata">
					<li> 	<p id="para-price-printout" class="para-price-printout"> </p> </li>
					<li> <a href="#" class="btn btn-sm btn-currency-convertor" id="btn-currency-convertor" title="Конвертировать в тенге" data-itemid="KZT"> </a> </li>
					<li>  <a href="#" class="btn btn-sm btn-expand-offer" id="btn-expand-offer"> Узнать, что включено в стоимость </a> </li>
					<li>  <a href="#" class="btn btn-sm btn-topdf" id="btn-topdf" title="Сохранить файл в pdf"></a> </li>
				 </ul>
			</section>
		</main>
<?php echo $footer; ?>

<script src="/catalog/view/javascript/podbor/adchr/build/app.bundle.js" defer></script>

