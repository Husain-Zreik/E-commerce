<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Favorite;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class PurchaseController extends Controller
{
    function addToCart(Request $req)
    {
        try {
            $product = Cart::where('user_id', $req->user_id)->where('product_id', $req->product_id)->first();
            if ($product == null) {
                $slot = Cart::create([
                    'user_id' => $req->user_id,
                    'product_id' => $req->product_id,
                    'quantity' => 1,
                ]);
            } else {
                $product->quantity = $product->quantity + 1;
                $product->save();
            }

            return response()->json([
                "status" => "success",
                "message" => "product added"
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => "failed",
                "message" => $th
            ]);
        }
    }

    function addToFavorite(Request $req)
    {

        $product = Favorite::where('user_id', $req->user_id)->where('product_id', $req->product_id)->first();
        if ($product == null) {
            $slot = Favorite::create(
                [
                    'user_id' => $req->user_id,
                    'product_id' => $req->product_id,
                ]
            );
            return response()->json([
                "status" => "success",
                "message" => "product added"
            ]);
        } else {
            return response()->json([
                "status" => "failed",
                "message" => "already favorite"
            ]);
        }
    }

    function getCartProduct(Request $req)
    {
        $cart = Cart::where('user_id', $req->user_id)->with("product")->get();

        if ($cart->count() > 0) {
            return response()->json([
                "status" => "success",
                "message" => "products displayed",
                "product" => $cart->map(function ($cartItem) {
                    return [
                        'id' => $cartItem->product->id,
                        'name' => $cartItem->product->name,
                        'price' => $cartItem->product->price,
                        'category' => $cartItem->product->category,
                        'description' => $cartItem->product->description,
                        'quantity' => $cartItem->quantity,
                    ];
                }),
            ]);
        } else {
            return response()->json([
                "status" => "failed",
                "message" => "No products"
            ]);
        }
    }

    function getFavoriteProduct(Request $req)
    {
        $favorite = Favorite::where('user_id', $req->user_id)->with("product")->get();

        if ($favorite->count() > 0) {
            return response()->json([
                "status" => "success",
                "message" => "products displayed",
                "product" => $favorite->map(function ($favoriteItem) {
                    return [
                        'id' => $favoriteItem->product->id,
                        'name' => $favoriteItem->product->name,
                        'price' => $favoriteItem->product->price,
                        'category' => $favoriteItem->product->category,
                        'description' => $favoriteItem->product->description,
                        'quantity' => $favoriteItem->quantity,
                    ];
                }),
            ]);
        } else {
            return response()->json([
                "status" => "failed",
                "message" => "No products"
            ]);
        }
    }
}
