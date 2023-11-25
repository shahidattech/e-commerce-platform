<style>
    .ui-button.ui-state-active:hover {
        /* border: 1px solid #003eff !important;
	background: #007fff !important; */
        /* font-weight: normal;
	color: #ffffff; */
    }

    .ui-menu .ui-menu-item {
        margin: 10px 0px !important;
    }

    .ui-menu .ui-menu-item:hover {
        background: #007fff;
        color: white !important;
    }

    @media only screen and (max-width: 600px) {
        .ui-autocomplete-row {
            clear: both;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
        }

        form.example button {
            width: 20%;
        }

        .example {
            padding: 10px;
        }
    }

    @media only screen and (min-width: 600px) {
        form.example button {
            width: 100px;
        }

        form.example input[type=text] {
            width: 60%;
            margin-left: 150px;
        }

        .example {
            padding: 10px;
        }
    }

    .ui-widget.ui-widget-content {
        z-index: 999999;
    }
</style>
<!-- <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> -->
<script>
    $(window).load(function() {
        cartTotal();
        shoppingCart();
    });
    // cartTotal();
    // shoppingCart();

    function addtocart(key, price, name, pic) {
        // console.log(key);
        // document.getElementById("add_to_cart_" + key).style.pointerEvents = 'none';
        // document.getElementById("add_to_cart_" + key).innerHTML = "ADDING TO CART";
        var weight = $("#pweight option:selected").val();
        console.log(weight);
        if(!weight){
            weight = 0.5;
        }
        console.log('w', weight);
        $.ajax({
            type: 'post',
            url: 'cartadd.php',
            data: {
                cartadd: 'cartadd',
                key,
                price,
                name,
                pic,
                weight
            },
            success: function(response) {
                // console.log(response);
                if (response) {
                    var res_json = JSON.parse(response);
                    if (res_json.status == 'success') {
                        document.getElementById("total_cart_item").innerHTML = res_json.total_cart_item;
                        cartTotalCalculate();
                        shoppingCart();
                        swal("Success!", "Successfully added to the cart", "success").then((value) => {
                            window.location.href = "cart.php"
                        });
                    }
                }
            }
        });
    }

    function cartTotal() {
        $.ajax({
            type: 'post',
            url: 'cartadd.php',
            data: {
                carttotal: 'carttotal'
            },
            success: function(response) {
                // console.log(response);
                if (response) {
                    document.getElementById("total_cart_item").innerHTML = response;
                }
            }
        });
    }

    function cartTotalCalculate() {
        $.ajax({
            type: 'post',
            url: 'cartadd.php',
            data: {
                grandtotalPriceCalculate: 'grandtotalPriceCalculate'
            },
            success: function(response) {
                // console.log(response);
            }
        });
    }

    function removeItem(id) {
        $.ajax({
            type: 'post',
            url: 'cartadd.php',
            data: {
                cartremove: 'cartremove',
                id
            },
            success: function(response) {
                // console.log(response);
                cartTotalCalculate();
                window.location.reload();
            }
        });
    }

    function cartIncrease(id) {
        // console.log(id);
        $.ajax({
            type: 'post',
            url: 'cartadd.php',
            data: {
                cartincrease: 'cartincrease',
                id
            },
            success: function(response) {
                // console.log(response);
                cartTotalCalculate();
                window.location.reload();
            }
        });
    }

    function cartDecrease(id) {
        $.ajax({
            type: 'post',
            url: 'cartadd.php',
            data: {
                cartdecrease: 'cartdecrease',
                id
            },
            success: function(response) {
                // console.log(response);
                cartTotalCalculate();
                window.location.reload();
            }
        });
    }

    function shoppingCart() {
        $.ajax({
            type: 'post',
            url: 'shopping-cart.php',
            data: {
                getShoppingCart: 'getShoppingCart'
            },
            success: function(response) {
                // console.log(response);
                document.getElementById('shoppingCart__listing').innerHTML = response;
            }
        });
    }
</script>

<script type="text/javascript" src="js/jquery-ui.js"></script>

<script>
    $(document).ready(function() {
        $("#searchInput").autocomplete({
            source: function(request, response) {
                $.getJSON("<?php echo $searchServer . 'productSearch'; ?>", {
                        term: $('#searchInput').val(),
                        userId: '<?php echo $userId; ?>'
                    },
                    response);
            },
            minLength: 1,
            select: function(event, ui) {
                $("#searchInput").val(ui.item._source.doc.title);
                $("#userID").val(ui.item._source.doc._id);
            }
        }).data("ui-autocomplete")._renderItem = function(ul, item) {
            console.log("ul", ul);
            item.value = item._source.doc.title;
            var rich_html = "<li class='ui-autocomplete-row'><img style='margin-right: 8px;margin-left: 8px;' width='40' src='" + item._source.doc.mainImage + "' />" + item._source.doc.title + "</li>";
            return $("<a href='product-detail.php?p=" + item._source.doc._id + "'></a>").data("item.autocomplete", item).append(rich_html).appendTo(ul);
        };
    });
</script>